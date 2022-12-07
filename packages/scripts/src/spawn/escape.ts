const metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;

export function escapeCommand(arg: string) {
    arg = arg.replace(metaCharsRegExp, "^$1");

    return arg;
}

export function escapeArgument(
    arg: string,
    needsDoubleEscapeMetaChars: boolean
) {
    arg = `${arg}`;
    arg = arg.replace(/(\\*)"/g, '$1$1\\"');
    arg = arg.replace(/(\\*)$/, "$1$1");
    arg = `"${arg}"`;
    arg = arg.replace(metaCharsRegExp, "^$1");
    if (needsDoubleEscapeMetaChars) arg = arg.replace(metaCharsRegExp, "^$1");

    return arg;
}