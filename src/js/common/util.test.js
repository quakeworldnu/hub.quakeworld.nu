import { deepCopy, serverAddressTitleByServer } from "./util";

describe("util", () => {
  test("deepCopy", () => {
    const original = { name: "John" };
    const copy = deepCopy(original);
    expect(original === copy).toBeFalsy();
  });

  test("serverTitleByServer", () => {
    expect(
      serverAddressTitleByServer({
        IpAddress: "212.42.38.88",
        Address: "quake.com:28502",
        Title: "quake server #1",
      })
    ).toEqual("quake.com:28502");

    expect(
      serverAddressTitleByServer({
        IpAddress: "212.42.38.88",
        Address: "188.166.0.137:28502",
        Title: "quake.com:28502",
      })
    ).toEqual("quake.com:28502");

    expect(
      serverAddressTitleByServer({
        IpAddress: "212.42.38.88",
        Address: "188.166.0.137:28502",
        Title: "quake.com",
      })
    ).toEqual("quake.com:28502 (212.42.38.88)");
  });
});
