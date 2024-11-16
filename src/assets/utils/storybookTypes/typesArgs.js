import { color } from '@/assets/utils/ColorClassConfig'


export const colorType = {
  options: Object.keys(color),
  control: { type: 'select' },
}

export const brightness = {
  options: ['900', '500', '100', '50'],
  control: { type: 'select' },
}

export const LoadingType = {
  options: ['circle', 'dual-ring', 'facebook', 'heart', 'ring', 'roller', 'default', 'ellipsis', 'grid', 'hourglass', 'ripple', 'spinner' ],
  control: { type: 'select' },
}