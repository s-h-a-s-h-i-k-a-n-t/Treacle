export const formatTime = (n: number) =>
  n
    ? new Date(n).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "Waiting for data";
