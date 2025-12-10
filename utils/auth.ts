export const ensureApiKey = async () => {
  try {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      return await (window as any).aistudio.openSelectKey();
    }
    return true;
  } catch (e) {
    console.error("API Key check failed", e);
    return false;
  }
};