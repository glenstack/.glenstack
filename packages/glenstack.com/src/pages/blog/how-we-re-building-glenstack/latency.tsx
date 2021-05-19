// Adapted from https://workers.cloudflare.com/

import { useState, useEffect, FC } from "react";

enum states {
  INIT = "init",
  TESTING = "testing",
  TESTED = "tested",
  ERROR = "error",
}

const getLatencyToCloudflare = async () => {
  const TEST_URL = "https://glenstack.com/cdn-cgi/trace";
  const NUM_TESTS = 5;

  let started = 0;
  async function load() {
    started++;

    await fetch(TEST_URL, {
      mode: "no-cors",
      cache: "no-store",
    });

    if (started < NUM_TESTS) await load();
  }

  await load();
  const entries = performance.getEntriesByName(
    TEST_URL,
    "resource"
  ) as PerformanceResourceTiming[];
  let min = Infinity;

  for (
    let i = Math.max(0, entries.length - NUM_TESTS);
    i < entries.length;
    i++
  ) {
    // iOS Safari doesn’t report duration
    const duration =
      entries[i].duration || entries[i].responseEnd - entries[i].fetchStart;

    if (duration < min) min = duration;
  }

  return min | 0;
};

export const Latency: FC = () => {
  const [state, setState] = useState(states.INIT);
  const [latency, setLatency] = useState<number | null>(null);

  const testLatency = async () => {
    try {
      setState(states.TESTING);
      const newLatency = await getLatencyToCloudflare();
      if (isNaN(newLatency) || newLatency === 0 || newLatency > 50)
        setLatency(null);

      setLatency(newLatency);
      setState(states.TESTED);
    } catch (err) {
      setState(states.ERROR);
    }
  };

  useEffect(() => {
    testLatency();
  }, []);

  return [states.INIT, states.ERROR].includes(state) ? null : (
    <p>
      In fact, you, dear reader, have just{" "}
      {latency && <strong>{latency} ms</strong>} of latency
      {state === states.TESTED && (
        <>
          {" "}
          (
          <button onClick={testLatency}>
            <strong className="underline !text-indigo-600">test again</strong>
          </button>
          )
        </>
      )}
      .
    </p>
  );
};
