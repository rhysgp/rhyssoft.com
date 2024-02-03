
export interface BlogSpan {
    style: number;
    text: string;
}

export interface BlogParagraph {
    style: number;
    texts: BlogSpan[]
}

export function blogs(): BlogParagraph[][] {

    return [
        /* add blogs here */
    ];

}
