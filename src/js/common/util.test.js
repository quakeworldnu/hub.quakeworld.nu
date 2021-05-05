import { deepCopy } from "./util";

describe("util", () => {
  test("deepCopy", () => {
    const original = { name: "John" };
    const copy = deepCopy(original);
    expect(original === copy).toBeFalsy();
  });
});
