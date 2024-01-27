
import { expect, describe, it } from 'vitest'
import simpleParaMd from './simple-para.md?raw'
import simpleParaTxt from './simple-para.txt?raw'
import twoParasMd from './two-paragraphs.md?raw'
import twoParasTxt from './two-paragraphs.txt?raw'
import headingsMd from './headings.md?raw'
import headingsAndTextMd from './headings-and-text.md?raw'
import listItemsMd from './list-items.md?raw'
import numberedItemsMd from './numbered-items.md?raw'
import horizontalRuleMd from './horizontal-rule.md?raw'

import { parseMarkdown, ParagraphStyle } from "../markdown-parser";

describe('parsing markdown', () => {
    it('should process a normal paragraph correctly', () => {
        const paragraphs = parseMarkdown('', simpleParaMd);
        expect(paragraphs.length).toBe(1);
        expect(paragraphs[0].texts.length).toBe(1);
        expect(paragraphs[0].texts[0].text).toBe(simpleParaTxt);
    })

    it('should process two consecutive paragraphs correctly', () => {
        const paragraphs = parseMarkdown('', twoParasMd);
        expect(paragraphs.length).toBe(2);
        const lines = (twoParasTxt as string).split('\n');
        expect(lines.length).toBe(2);
        expect(paragraphs[0].texts.length).toBe(1);
        expect(paragraphs[0].texts[0].text).toBe(lines[0]);
        expect(paragraphs[1].texts[0].text).toBe(lines[1]);
    });

    it('should process headings correctly', () => {
        const expectedParaTypes = [
            ParagraphStyle.Heading1,
            ParagraphStyle.Heading2,
            ParagraphStyle.Heading3,
            ParagraphStyle.Heading4,
            ParagraphStyle.Heading5,
            ParagraphStyle.Heading6,
        ];
        const paragraphs = parseMarkdown('', headingsMd);
        expect(paragraphs.length).toBe(6);
        for (let i = 0; i < 6; ++i) {
            expect(paragraphs[i].style).toBe(expectedParaTypes[i]);
            expect(paragraphs[i].texts.length).toBe(1);
            expect(paragraphs[i].texts[0].text).toBe(`Here is heading ${i+1}`);
        }
    });

    it('should process headings interspersed with text paragraphs correctly', () => {
        const paragraphs = parseMarkdown('', headingsAndTextMd);
        expect(paragraphs.length).toBe(7);
        expect(paragraphs[0].style).toBe(ParagraphStyle.Heading1);
        expect(paragraphs[1].style).toBe(ParagraphStyle.Normal);
        expect(paragraphs[2].style).toBe(ParagraphStyle.Heading2);
        expect(paragraphs[3].style).toBe(ParagraphStyle.Normal);
        expect(paragraphs[4].style).toBe(ParagraphStyle.Normal);
        expect(paragraphs[5].style).toBe(ParagraphStyle.Heading3);
        expect(paragraphs[6].style).toBe(ParagraphStyle.Normal);
    })

    it('should process unnumbered list items correctly', () => {
        const paragraphs = parseMarkdown('', listItemsMd);
        expect(paragraphs.length).toBe(3);
        expect(paragraphs[0].style).toBe(ParagraphStyle.Normal);
        expect(paragraphs[1].style).toBe(ParagraphStyle.UnnumberedList);
        expect(paragraphs[2].style).toBe(ParagraphStyle.Normal);

        expect(paragraphs[0].texts[0].text).toBe('Here are some list items:');
        expect(paragraphs[1].texts.length).toBe(3);
        expect(paragraphs[1].texts[0].text).toBe('This is the first one');
        expect(paragraphs[1].texts[1].text).toBe('This is the second one');
        expect(paragraphs[1].texts[2].text).toBe('This is the third one');
        expect(paragraphs[2].texts[0].text).toBe('etc.');
    });

    it('should process numbered list items correctly', () => {
        const paragraphs = parseMarkdown('', numberedItemsMd);
        expect(paragraphs.length).toBe(3);
        expect(paragraphs[0].style).toBe(ParagraphStyle.Normal);
        expect(paragraphs[1].style).toBe(ParagraphStyle.NumberedList);
        expect(paragraphs[2].style).toBe(ParagraphStyle.Normal);

        expect(paragraphs[0].texts[0].text).toBe('Here are my terms:');
        expect(paragraphs[1].texts.length).toBe(5);
        expect(paragraphs[1].texts[0].text).toBe('There must be some marmalade');
        expect(paragraphs[1].texts[1].text).toBe('There must be toast to go with the marmalade');
        expect(paragraphs[1].texts[2].text).toBe('There must be butter and it must be unsalted; or there will be trouble!');
        expect(paragraphs[1].texts[3].text).toBe('The marmalade must be Vintage Oxford Marmalade');
        expect(paragraphs[1].texts[4].text).toBe('Or there will be trouble!');
        expect(paragraphs[2].texts[0].text).toBe('I think you know what I mean.');
    });

    it('should process horizontal rule correctly', () => {
        const paragraphs = parseMarkdown('', horizontalRuleMd);
        expect(paragraphs.length).toBe(3);
        expect(paragraphs[0].style).toBe(ParagraphStyle.Normal);
        expect(paragraphs[1].style).toBe(ParagraphStyle.HorizontalRule);
        expect(paragraphs[2].style).toBe(ParagraphStyle.Normal);
        expect(paragraphs[0].texts[0].text).toBe('Here is my first paragraph.');
        expect(paragraphs[2].texts[0].text).toBe('Here is my second paragraph.');
    });
});