"use client";

import { Button } from "./ui/button";
import { useState, useEffect, useCallback } from "react";
import { Loader2, RefreshCw } from "lucide-react";

type StatusType = 'loading' | 'healthy' | 'unhealthy' | 'error';

interface HealthResponse {
  status: string;
  timestamp: string;
  uptime?: number;
  environment?: string;
  error?: string;
}

export default function BackendStatus() {
  const [status, setStatus] = useState<StatusType>('loading');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [isManualRefresh, setIsManualRefresh] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const checkHealth = useCallback(async (isManual = false) => {
    try {
      if (isManual) setIsManualRefresh(true);
      setStatus('loading');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('/api/health', {
        signal: controller.signal,
        cache: 'no-store'
      });
      
      clearTimeout(timeoutId);
      const data: HealthResponse = await response.json();
      
      if (response.ok && data.status === 'healthy') {
        setStatus('healthy');
        setRetryCount(0);
      } else {
        setStatus('unhealthy');
      }
      setLastChecked(new Date());
    } catch (error) {
      console.error('Health check failed:', error);
      
      if (error instanceof Error && error.name === 'AbortError') {
        setStatus('error');
      } else if (retryCount < 2) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => checkHealth(), 1000 * (retryCount + 1));
        return;
      } else {
        setStatus('error');
      }
      setLastChecked(new Date());
    } finally {
      if (isManual) {
        setTimeout(() => setIsManualRefresh(false), 500);
      }
    }
  }, [retryCount]);

  useEffect(() => {
    checkHealth();
    
    const interval = setInterval(() => checkHealth(), 30000);
    
    return () => clearInterval(interval);
  }, [checkHealth]);

  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case 'loading':
        return {
          color: 'bg-yellow-500',
          text: 'Checking...',
          textColor: 'text-yellow-700',
          borderColor: 'border-yellow-200',
          bgColor: 'bg-yellow-50 hover:bg-yellow-100'
        };
      case 'healthy':
        return {
          color: 'bg-green-500',
          text: 'Online',
          textColor: 'text-green-700',
          borderColor: 'border-green-200',
          bgColor: 'bg-green-50 hover:bg-green-100'
        };
      case 'unhealthy':
        return {
          color: 'bg-red-500',
          text: 'Unhealthy',
          textColor: 'text-red-700',
          borderColor: 'border-red-200',
          bgColor: 'bg-red-50 hover:bg-red-100'
        };
      case 'error':
        return {
          color: 'bg-red-500',
          text: 'Offline',
          textColor: 'text-red-700',
          borderColor: 'border-red-200',
          bgColor: 'bg-red-50 hover:bg-red-100'
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  const handleManualRefresh = () => {
    if (status !== 'loading') {
      setRetryCount(0);
      checkHealth(true);
    }
  };

  const getTooltipText = () => {
    const baseText = lastChecked 
      ? `Last checked: ${lastChecked.toLocaleTimeString()}` 
      : 'Click to check status';
    
    if (retryCount > 0) {
      return `${baseText} (Retry ${retryCount}/2)`;
    }
    return baseText;
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleManualRefresh}
      disabled={status === 'loading'}
      className={`hidden sm:flex items-center gap-2 transition-all duration-200 ${statusConfig.textColor} ${statusConfig.borderColor} ${statusConfig.bgColor}`}
      title={getTooltipText()}
    >
      {status === 'loading' ? (
        isManualRefresh ? (
          <RefreshCw className="w-2 h-2 animate-spin" />
        ) : (
          <Loader2 className="w-2 h-2 animate-spin" />
        )
      ) : (
        <div 
          className={`w-2 h-2 rounded-full ${statusConfig.color} ${status === 'healthy' ? 'animate-pulse' : ''}`} 
        />
      )}
      <span className="font-medium">{statusConfig.text}</span>
    </Button>
  );
}