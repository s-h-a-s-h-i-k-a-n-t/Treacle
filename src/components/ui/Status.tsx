export function Status({ value }: { value: string }) {
  return (
    <span className={"status " + value.toLowerCase()}>
      <i />
      {value === "OK"
        ? "Normal"
        : value === "WARN"
          ? "Warning"
          : value === "CRITICAL"
            ? "Critical"
            : value}
    </span>
  );
}
