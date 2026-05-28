import React from 'react';
import { useIsMobile } from '../../utils/useIsMobile';
import { MobileLayout } from './MobileLayout';
import { WebLayout } from './WebLayout';

export function Home(props) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileLayout {...props} />;
  }

  return <WebLayout {...props} />;
}
