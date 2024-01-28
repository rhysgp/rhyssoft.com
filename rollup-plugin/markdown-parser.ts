
enum LineType {
    Empty,
    Normal,
    BulletItem,
    NumberedListItem,
    Heading,
    BlockQuote,
    HorizontalRule
}

export enum ParagraphStyle {
    Normal,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Heading6,
    NumberedList,
    UnnumberedList,
    BlockQuote,
    HorizontalRule
}

export enum InlineStyle {
    Normal,
    ListItem,
    Italic,
    Bold,
}

class StyledText {
    style: InlineStyle;
    text: string;
    constructor(style: InlineStyle, text: string) {
        this.style = style;
        this.text = text;
    }

    addText(s: string): void {
        this.text += s;
    }
}

class Paragraph {
    style: ParagraphStyle;
    texts: StyledText[];

    constructor(style: ParagraphStyle) {
        this.style = style;
        this.texts = [];
    }

    addText(text: StyledText): void {
        this.texts.push(text);
    }
}

export function parseMarkdown(file: string, md: string): Paragraph[] {
    console.log("--------------------------------------------");
    console.log(file);
    console.log(md);
    console.log("--------------------------------------------");

    /*
     * BulletItem,
     * NumberedListItem,
     * Heading,
     * BlockQuote
     */
    const determineLineType = (line: string): LineType => {
        const l = line.trim();
        if (l.length === 0)
            return LineType.Empty;
        else if (l.startsWith("---"))
            return LineType.HorizontalRule
        else if (l.startsWith('-'))
            return LineType.BulletItem;
        else if (l.match(/^[0-9]+\.\s.*/))
            return LineType.NumberedListItem;
        else if (l.startsWith('#'))
            return LineType.Heading;
        else if (l.startsWith("```"))
            return LineType.BlockQuote;
        else
            return LineType.Normal;
    }

    const extractBulletText = (line: string): string => {
        const match = line.match(/\s*(?:-|[0-9]+\.)\s*(.+)/);
        if (!match) throw new Error("Failed to extract bullet text");
        return match[1].trim();
    }

    const currentParagraphIsList = () => {
        const listParagraphTypes = [
            ParagraphStyle.NumberedList, ParagraphStyle.UnnumberedList
        ];
        return currentParagraph
            && listParagraphTypes.includes(currentParagraph.style);
    }

    const processEmpty = () => {
        if (currentParagraph) {
            currentParagraph = undefined;
        } else {
            // push an empty paragraph, if that's what the markdown says!
            paragraphs.push(new Paragraph(ParagraphStyle.Normal));
        }
    }

    const processNormal = (line: string) => {
        const isContinuation = currentParagraph
            && (
                (currentParagraphIsList() && line.match(/^\s+.*/))
                  || currentParagraph.style === ParagraphStyle.Normal
                  || currentParagraph.style === ParagraphStyle.BlockQuote
            )
        if (currentParagraph && isContinuation) {
            currentParagraph.texts[currentParagraph.texts.length - 1].addText(' ' + line.trim());
        } else {
            const p = new Paragraph(ParagraphStyle.Normal);
            p.addText(new StyledText(InlineStyle.Normal, line.trim()));
            currentParagraph = p;
            paragraphs.push(p);
        }
    }

    const processHeading = (line: string) => {
        const match = line.match(/^\s*(#*)(.+)$/);
        if (!!match) {
            const group = match[1];
            var style: ParagraphStyle;
            switch (group.length) {
                case 1:
                    style = ParagraphStyle.Heading1;
                    break;
                case 2:
                    style = ParagraphStyle.Heading2;
                    break;
                case 3:
                    style = ParagraphStyle.Heading3;
                    break;
                case 4:
                    style = ParagraphStyle.Heading4;
                    break;
                case 5:
                    style = ParagraphStyle.Heading5;
                    break;
                case 6:
                    style = ParagraphStyle.Heading6;
                    break;
                default:
                    style = ParagraphStyle.Normal;
            }
            const text = match[2];
            currentParagraph =  new Paragraph(style);
            currentParagraph.addText(new StyledText(InlineStyle.Normal, text));
            paragraphs.push(currentParagraph);
        }
    }

    const processLineItem = (line: string, pStyle: ParagraphStyle) => {
        if (!currentParagraph || currentParagraph.style !== pStyle) {
            currentParagraph = new Paragraph(pStyle);
            paragraphs.push(currentParagraph);
        }
        currentParagraph.addText(
            new StyledText(
                InlineStyle.ListItem,
                extractBulletText(line)
            )
        );

    }

    const processBlockQuote = () => {
        if (!currentParagraph || currentParagraph.style !== ParagraphStyle.BlockQuote) {
            currentParagraph = new Paragraph(ParagraphStyle.BlockQuote);
            paragraphs.push(currentParagraph);
        } else {
            currentParagraph = undefined; // end of block quote para
        }
    }

    const processHorizontalRule = () => {
        paragraphs.push(new Paragraph(ParagraphStyle.HorizontalRule));
        currentParagraph = undefined;
    }

    // @todo Finish parsing bold/italic using character parser
    /*
    const parseBoldAndItalic = (s: string) => {
        const ss: StyledText[] = [];
        let lastChar: string | undefined = undefined;

        for (const c of s) {
            if (c === '_' || c === '*') {
                if (lastChar === undefined || [' ', '\t'].includes(lastChar)) {

                }
            }
            lastChar = c;
        }
        return ss;
    }
    */

    const mergeConsecutiveStyles = (ss: StyledText[]) => {
        if (ss.length < 2) return ss;
        const merged: StyledText[] = [ ss[0] ];
        for (let i = 1; i < ss.length; i++) {
            const prev = merged[merged.length - 1];
            const st = ss[i];
            if (st.style === prev.style) {
                prev.text += st.text;
            } else {
                merged.push(st);
            }
        }
        return merged;
    }

    /*
     * NB This doesn't support bold+italic. This could be supported by checking,
     * when splitting italics, that there is not a bold region that is larger
     * than the italics; and vice versa; and then splitting
     */
    const parseInlineStyles = (st: StyledText): StyledText[] => {
        const italicPattern = /(^|\s)_(.*?)_(\s|,|.|;|:|$)/g;
        const boldPattern = /(^|\s)\*\*(.*?)\*\*(\s|,|.|;|:|$)/g;

        const parse = (st: StyledText, re: RegExp, style: InlineStyle): StyledText[] => {
            const ss: StyledText[] = [];
            const matches = st.text.matchAll(re);
            let endLastMatchIndex = 0;

            for (const match of matches) {
                const preSpace = match[1];
                const italicText = match[2];
                const postSpace = match[3];
                if (ss.length === 0 && match.index && match.index > endLastMatchIndex) {
                    ss.push(new StyledText(st.style, st.text.substring(0, match.index) + preSpace));
                }
                ss.push(new StyledText(style, italicText));
                ss.push(new StyledText(st.style, postSpace));
                endLastMatchIndex = (match.index ?? 0) + match[0].length;
            }

            if (endLastMatchIndex < st.text.length) {
                ss.push(new StyledText(st.style, st.text.substring(endLastMatchIndex)));
            }

            return ss.length > 0 ? mergeConsecutiveStyles(ss) : [ st ];
        }

        const texts = parse(st, italicPattern, InlineStyle.Italic);
        return texts.flatMap((st) => parse(st, boldPattern, InlineStyle.Bold));
    }

    const parseInlineStylesForParagraph = (paragraph: Paragraph) => {
        const newStyledTexts: StyledText[] = [];
        for (const st of paragraph.texts) {
            const ss = parseInlineStyles(st);
            newStyledTexts.push(...ss);
        }
        paragraph.texts = newStyledTexts;
    }

    const paragraphs: Paragraph[] = [];
    let currentParagraph: Paragraph | undefined = undefined;
    const lines = md.split('\n');

    for (const line of lines) {
        switch (determineLineType(line)) {
            case LineType.Empty:
                processEmpty();
                break;
            case LineType.Normal:
                processNormal(line);
                break;
            case LineType.Heading:
                processHeading(line);
                break;
            case LineType.BulletItem:
                processLineItem(line, ParagraphStyle.UnnumberedList);
                break;
            case LineType.NumberedListItem:
                processLineItem(line, ParagraphStyle.NumberedList);
                break;
            case LineType.BlockQuote:
                processBlockQuote();
                break;
            case LineType.HorizontalRule:
                processHorizontalRule();
                break;
            default:
                break;
        }
    }

    paragraphs.forEach(p => parseInlineStylesForParagraph(p))

    return paragraphs;
}
