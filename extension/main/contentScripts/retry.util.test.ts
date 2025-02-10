import { retryAndGetIfSucceeded } from "./retry.util";

it("Retries", async () => {
  const getIfConditionMet = jest.fn(() => false);
  const retries = 3;
  const succeeded: boolean = await retryAndGetIfSucceeded({
    retries,
    delayMs: 1,
    getIfConditionMet,
  });
  expect(succeeded).toBeFalsy();
  expect(getIfConditionMet).toHaveBeenCalledTimes(retries);
});

it("Stops retrying when the condition was met", async () => {
  const getIfConditionMet = jest.fn(() => true);
  const succeeded: boolean = await retryAndGetIfSucceeded({
    retries: 3,
    delayMs: 1,
    getIfConditionMet,
  });
  expect(succeeded).toBeTruthy();
  expect(getIfConditionMet).toHaveBeenCalledTimes(1);
});
