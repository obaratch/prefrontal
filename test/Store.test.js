import { Store } from "../src/Store";

describe("Store", () => {
  it("should initialize", () => {
    const store = new Store();
    expect(store.state).toMatchObject({});
    expect(typeof store.lastUpdated).toBe("number");
  });

  it("should initialize with initial values", () => {
    const initState = { msg: "hello" };
    const store = new Store(initState);
    expect(store.state).toMatchObject(initState);

    store.init({ msg: "hi!", edited: true });
    expect(store.state.msg).toBe("hi!");
    expect(store.state.edited).toBe(true);

    store.init();
    expect(store.state).toMatchObject(initState);
    expect(store.state.edited).toBeUndefined();
  });

  it("should update its internal timestamp", () => {
    const store = new Store();
    const prev = store.lastUpdated;
    return new Promise((resolve) => {
      setTimeout(() => {
        store.init();
        const next = store.lastUpdated;
        resolve(expect(next).toBeGreaterThan(prev));
        // console.log({ prev, next, diff: next - prev });
      }, 1);
    });
  });

  it("should update state in async", async () => {
    const store = new Store();
    await store.update({ msg: "hello" });
    expect(store.state.msg).toBe("hello");
  });

  it("should callback when updated (function)", async () => {
    const store = new Store();
    store.subscribe(() => {
      expect(store.state.msg).toBe("hello");
    });
    store.update({ msg: "hello" });
  });

  it("should callback when updated (object)", async () => {
    const store = new Store();
    store.subscribe({
      callback: () => {
        expect(store.state.msg).toBe("hello");
      },
    });
    store.update({ msg: "hello" });
  });

  it("should callback when updated (React Component)", async () => {
    const store = new Store();
    store.subscribe({
      setState: (state) => {
        expect(state.msg).toBe("hello");
      },
    });
    store.update({ msg: "hello" });
  });
});
