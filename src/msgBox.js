import chalk from 'chalk'
import boxen from 'boxen'

const boxenOptions = {
  padding: 1,
  margin: 1,
  borderStyle: 'round',
  borderColor: 'green',
  backgroundColor: '#555555'
}

export default ({
  message = 'Welcome to Boom!',
  color = 'yellow',
  options = boxenOptions
} = {}) => 
  boxen(chalk[color].bold(message), options)
