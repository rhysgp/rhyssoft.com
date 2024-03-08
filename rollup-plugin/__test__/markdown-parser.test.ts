
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
import blockQuoteMd from './block-quote.md?raw'
import firstBlogPost from '../../blogs/001_intro.md?raw'
import secondBlogPost from '../../blogs/002_rollup-plugin.md?raw'

import {parseMarkdown, ParagraphStyle, InlineStyle, Link} from "../markdown-parser";

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

    it('should process block quote correctly', () => {
        const paragraphs = parseMarkdown('', blockQuoteMd);
        expect(paragraphs.length).toBe(1);
        expect(paragraphs[0].texts.length).toBe(1);
        expect(paragraphs[0].texts[0].text).toBe('rm -f -r *\nls -l');
    });

    it('should process italics correctly', () => {
        const paragraphs = parseMarkdown('', 'Here there _be_ dragons');
        expect(paragraphs[0].texts.length).toBe(3);
        expect(paragraphs[0].texts[0].text).toBe('Here there ');
        expect(paragraphs[0].texts[0].style).toBe(InlineStyle.Normal);
        expect(paragraphs[0].texts[1].text).toBe('be');
        expect(paragraphs[0].texts[1].style).toBe(InlineStyle.Italic);
        expect(paragraphs[0].texts[2].text).toBe(' dragons');
        expect(paragraphs[0].texts[2].style).toBe(InlineStyle.Normal);
    });

    it('should process bold correctly', () => {
        const paragraphs = parseMarkdown('', 'Here there **are** dragons');
        expect(paragraphs[0].texts.length).toBe(3);
        expect(paragraphs[0].texts[0].text).toBe('Here there ');
        expect(paragraphs[0].texts[0].style).toBe(InlineStyle.Normal);
        expect(paragraphs[0].texts[1].text).toBe('are');
        expect(paragraphs[0].texts[1].style).toBe(InlineStyle.Bold);
        expect(paragraphs[0].texts[2].text).toBe(' dragons');
        expect(paragraphs[0].texts[2].style).toBe(InlineStyle.Normal);
    });

    it('should process bold correctly when there are two in the text', () => {
        const paragraphs = parseMarkdown('', 'Here there **are** dragons that **aren\'t dangerous**!');
        expect(paragraphs[0].texts.length).toBe(5);
        expect(paragraphs[0].texts[0].text).toBe('Here there ');
        expect(paragraphs[0].texts[0].style).toBe(InlineStyle.Normal);
        expect(paragraphs[0].texts[1].text).toBe('are');
        expect(paragraphs[0].texts[1].style).toBe(InlineStyle.Bold);
        expect(paragraphs[0].texts[2].text).toBe(' dragons that ');
        expect(paragraphs[0].texts[2].style).toBe(InlineStyle.Normal);
        expect(paragraphs[0].texts[3].text).toBe('aren\'t dangerous');
        expect(paragraphs[0].texts[3].style).toBe(InlineStyle.Bold);
        expect(paragraphs[0].texts[4].text).toBe('!');
        expect(paragraphs[0].texts[4].style).toBe(InlineStyle.Normal);
    });

    it('should process URL links', () => {
        const paragraphs = parseMarkdown('', 'Please click [here](https://www.example.com/here) for details');
        expect(paragraphs[0].texts.length).toBe(3);
        expect(paragraphs[0].texts[0].text).toBe('Please click ');
        expect(paragraphs[0].texts[0].style).toBe(InlineStyle.Normal);
        expect(paragraphs[0].texts[1].text).toBe('here');
        expect((paragraphs[0].texts[1] as Link).href).toBe('https://www.example.com/here');
        expect(paragraphs[0].texts[1].style).toBe(InlineStyle.Link);
        expect(paragraphs[0].texts[2].text).toBe(' for details');
        expect(paragraphs[0].texts[2].style).toBe(InlineStyle.Normal);
    });

    it('should process URL links when there are two', () => {
        const paragraphs = parseMarkdown('', '[Vite](https://vitejs.dev/) is a tool for frontend development, \n' +
            'which I use for developing VueJS apps. Under the bonnet, vite uses \n' +
            '[Rollup](https://rollupjs.org/), a module bundler.');
        expect(paragraphs[0].texts.length).toBe(4);
        expect(paragraphs[0].texts[0].text).toBe('Vite');
        expect((paragraphs[0].texts[0] as Link).href).toBe('https://vitejs.dev/');
        expect(paragraphs[0].texts[0].style).toBe(InlineStyle.Link);
        expect(paragraphs[0].texts[1].text).toBe(' is a tool for frontend development, which I use for developing VueJS apps. Under the bonnet, vite uses ');
        expect(paragraphs[0].texts[1].style).toBe(InlineStyle.Normal);
        expect(paragraphs[0].texts[2].text).toBe('Rollup');
        expect((paragraphs[0].texts[2] as Link).href).toBe('https://rollupjs.org/');
        expect(paragraphs[0].texts[2].style).toBe(InlineStyle.Link);
        expect(paragraphs[0].texts[3].text).toBe(', a module bundler.');
        expect(paragraphs[0].texts[3].style).toBe(InlineStyle.Normal);
    });

    it('should parse the first blog post', () => {
        const paragraphs = parseMarkdown('', firstBlogPost);
        console.log(paragraphs);
    });

    it('should parse the second blog post', () => {
        const paragraphs = parseMarkdown('', secondBlogPost);
        console.log(paragraphs);
    });

    it('should parse small block quote properly', () => {
        const paragraphs = parseMarkdown('', 'Here\n```\nis my block\n```\nthat\'s cool.');
        expect(paragraphs.length).toBe(3);
    })

    it('should parse single tick code', () => {
        const paragraphs = parseMarkdown('', 'This is `code`, baby!');
        expect(paragraphs.length).toBe(1);
        expect(paragraphs[0].texts.length).toBe(3);
        expect(paragraphs[0].texts[0].text).toBe('This is ');
        expect(paragraphs[0].texts[0].style).toBe(InlineStyle.Normal);
        expect(paragraphs[0].texts[1].text).toBe('code');
        expect(paragraphs[0].texts[1].style).toBe(InlineStyle.Code);
        expect(paragraphs[0].texts[2].text).toBe(', baby!');
        expect(paragraphs[0].texts[2].style).toBe(InlineStyle.Normal);
    });
});
