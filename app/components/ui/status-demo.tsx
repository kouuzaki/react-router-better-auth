import { Status, StatusIndicator, StatusLabel } from "~/components/ui/status";

export function StatusDemo() {
    return (
        <div className="flex flex-col gap-4 p-4">
            <h3 className="text-lg font-semibold">Status Components Demo</h3>

            {/* Online status with blinking dot */}
            <Status status="online">
                <StatusIndicator />
                <StatusLabel />
            </Status>

            {/* Offline status */}
            <Status status="offline">
                <StatusIndicator />
                <StatusLabel />
            </Status>

            {/* Maintenance status */}
            <Status status="maintenance">
                <StatusIndicator />
                <StatusLabel />
            </Status>

            {/* Degraded status */}
            <Status status="degraded">
                <StatusIndicator />
                <StatusLabel />
            </Status>

            {/* Custom label example */}
            <Status status="online">
                <StatusIndicator />
                <StatusLabel>Custom Online Status</StatusLabel>
            </Status>
        </div>
    );
}