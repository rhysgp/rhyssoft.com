
export interface BlogSpan {
    style: any;
    text: string;
}

export interface BlogParagraph {
    style: any;
    texts: BlogSpan[]
}

export function blogs(): BlogParagraph[][] {

    return [
        /* add blogs here */
    ];

}
