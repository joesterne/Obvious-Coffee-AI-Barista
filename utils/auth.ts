export const ensureApiKey = async () => {
  const aistudio = (window as any).aistudio;
  if (!aistudio) {
    // Outside the AI Studio host there is no key picker (window.aistudio is
    // undefined, and calling it threw — the catch then silently disabled all
    // video features). The env-provided key is used directly in that case.
    return !!process.env.API_KEY;
  }
  try {
    const hasKey = await aistudio.hasSelectedApiKey();
    if (!hasKey) {
      return await aistudio.openSelectKey();
    }
    return true;
  } catch (e) {
    console.error("API Key check failed", e);
    return false;
  }
};
