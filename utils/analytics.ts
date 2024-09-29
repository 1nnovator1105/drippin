import * as amplitude from "@amplitude/analytics-browser";

export function init() {
  amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY as string, {
    defaultTracking: true,
  });
}

export function logEvent(event: string, properties?: Record<string, any>) {
  amplitude.track(event, properties);
}
