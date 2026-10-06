import React from 'react';
import { FastForward, RefreshCw, HardDrive, Info, Clock, Trash2 } from 'lucide-react';

interface DemoControlsProps {
  onFastForward24h: () => void;
  onResetSeedData: () => void;
  onClearStorage: () => void;
  storageUsageKb: number;
  simulatedTimeOffsetHours: number;
  activeStoryCount: number;
}

export const DemoControls: React.FC<DemoControlsProps> = ({
  onFastForward24h,
  onResetSeedData,
  onClearStorage,
  storageUsageKb,
  simulatedTimeOffsetHours,
  activeStoryCount,
}) => {
  return (
    <div className="demo-controls-bar">
      <div className="demo-controls-header">
        <div className="demo-title">
          <Clock size={16} className="title-icon" />
          <span>Dev & Simulation Controls</span>
        </div>
        <div className="active-badge">
          <span>{activeStoryCount} Active Stories</span>
        </div>
      </div>

      <div className="demo-actions-row">
        {/* +24 Hours Time Travel Button */}
        <button
          type="button"
          className="demo-btn fast-forward-btn"
          onClick={onFastForward24h}
          title="Simulate passing 24 hours to test story expiration"
        >
          <FastForward size={16} />
          <span>Fast Forward +24h</span>
        </button>

        {/* Reset Sample Seed Stories */}
        <button
          type="button"
          className="demo-btn reset-btn"
          onClick={onResetSeedData}
          title="Reset to default sample stories"
        >
          <RefreshCw size={15} />
          <span>Reset Demo Stories</span>
        </button>

        {/* Clear Storage */}
        <button
          type="button"
          className="demo-btn clear-btn"
          onClick={onClearStorage}
          title="Clear local storage stories"
        >
          <Trash2 size={15} />
          <span>Clear Storage</span>
        </button>
      </div>

      {/* Storage & Simulated Time Info */}
      <div className="demo-info-footer">
        <div className="info-item">
          <HardDrive size={13} />
          <span>Storage: <strong>{storageUsageKb.toFixed(1)} KB</strong></span>
        </div>

        {simulatedTimeOffsetHours > 0 && (
          <div className="info-item simulated-time-tag">
            <Info size={13} />
            <span>Time Shifted: <strong>+{simulatedTimeOffsetHours} Hours</strong></span>
          </div>
        )}
      </div>
    </div>
  );
};
