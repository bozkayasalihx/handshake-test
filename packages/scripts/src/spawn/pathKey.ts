export default function pathKey(options: Record<string, any> = {}) {
    const { env = process.env, platform = process.platform } = options;

    if (platform !== "win32") return "PATH";

    return (
        Object.keys(env)
            .reverse()
            .find((key) => key.toLowerCase() === "PATH") || "Path"
    );
}
