const waitMs = async (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

interface FieldsToRetryOperation {
  retries: number;
  delayMs: number;
  getIfConditionMet: () => boolean;
}

export const retryAndGetIfSucceeded = async ({
  retries,
  delayMs,
  getIfConditionMet,
}: FieldsToRetryOperation): Promise<boolean> => {
  for (let retryCount = 1; retryCount < retries; retryCount++) {
    const succeeded: boolean = getIfConditionMet();
    if (succeeded) return true;
    await waitMs(delayMs);
  }

  return false;
};
