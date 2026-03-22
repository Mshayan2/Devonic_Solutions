import React from 'react'
import { iconMap } from './iconMap'

export default function Icon({ name, icon: IconComp, size = 20, className = '', ariaLabel, imageSrc }){
  if(imageSrc){
    return <img src={imageSrc} alt={ariaLabel || ''} className={className} style={{width:size,height:size}} />
  }

  const Comp = IconComp || iconMap[name]
  if(!Comp) return <span className={className} aria-hidden="true" />

  return <Comp className={className} size={size} aria-label={ariaLabel} />
}
