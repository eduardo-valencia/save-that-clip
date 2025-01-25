import { retryAndGetIfSucceeded } from "./retry.util";

it("Retries", async () => {
  const getIfConditionMet = jest.fn(() => false);
  const retries = 3;
  await retryAndGetIfSucceeded({ retries, delayMs: 1, getIfConditionMet });
  expect(getIfConditionMet).toHaveBeenCalledTimes(retries);
});

it("Stops retrying when the condition was met", async () => {
  const getIfConditionMet = jest.fn(() => true);
  await retryAndGetIfSucceeded({ retries: 3, delayMs: 1, getIfConditionMet });
  expect(getIfConditionMet).toHaveBeenCalledTimes(1);
});
