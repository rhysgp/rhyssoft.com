
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

enum InlineStyle {
    Raw,
    Normal,
    ListItem,
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

    const continuationParagraphTypes = [
        ParagraphStyle.Normal,
        ParagraphStyle.NumberedList,
        ParagraphStyle.UnnumberedList,
        ParagraphStyle.BlockQuote,
    ];

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
            p.addText(new StyledText(InlineStyle.Raw, line.trim()));
            currentParagraph = p;
            paragraphs.push(p);
        }
    }

    const processingHeading = (line: string) => {
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
            currentParagraph.addText(new StyledText(InlineStyle.Raw, text));
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

    const paragraphs: Paragraph[] = [];
    let currentParagraph: Paragraph | undefined = undefined;
    const lines = md.split('\n');

    for (const line of lines) {
        switch (determineLineType(line)) {
            case LineType.Empty:
                if (currentParagraph) {
                    currentParagraph = undefined;
                } else {
                    // push an empty paragraph, if that's what the markdown says!
                    paragraphs.push(new Paragraph(ParagraphStyle.Normal));
                }
                break;
            case LineType.Normal:
                processNormal(line);
                break;
            case LineType.Heading:
                processingHeading(line);
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

    // @todo Now, parse each block's inline styles. That'll be fun.

    return paragraphs;
}
