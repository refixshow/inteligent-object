interface IGenericObject {
  [key: string]: any;
}

type TOnChange = (
  key: string,
  prevValue: any,
  nextValue: any,
  timestamp: number
) => void;

class InteligentObject {
  [key: string]: any;
  // ?
  constructor(props: IGenericObject) {
    Object.assign(this, props);

    return new Proxy(this, {
      get: function (target, key) {
        const parsedKey = String(key);
        if (target[parsedKey]) return target[parsedKey];
        throw new Error(`key "${parsedKey}" doesn't exist on object`);
      },
      set: function (target, key, value) {
        const parsedKey = String(key);

        if (!target[parsedKey]) {
          throw new Error("cannot set outsite of contructor");
        }

        if (target[parsedKey] !== value) {
          const prevVal = target[parsedKey];

          let counter = 0;
          const timer = setInterval(() => {
            counter++;
          }, 1);
          target[parsedKey] = value;
          clearInterval(timer);

          target.onChange(key, prevVal, value, counter);
          return true;
        }
        return false;
      },
    });
  }

  onChange(key, prevValue, nextValue, timestamp): TOnChange {
    console.log(
      `key value ${key} has changed from ${prevValue} to ${nextValue} in ${timestamp}ms`
    );
    return;
    // ??
  }
}
