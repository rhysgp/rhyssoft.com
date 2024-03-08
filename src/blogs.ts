
export interface BlogSpan {
    style: any;
    text: string;
    href?: string;
}

export interface BlogParagraph {
    style: any;
    texts: BlogSpan[];
    type?: string;
}

export function blogs(): BlogParagraph[][] {

    return [
        /* add blogs here */
    ];

}
