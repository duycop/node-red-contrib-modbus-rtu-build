# node-red-contrib-modbus-rtu-build

Node-RED function build content modbus-rtu

Code by Do Duy Cop

## Configuration

nothing

## Examples

	FUNCTION = CRC ONLY:

		msg.payload = Buffer.from('010300040001', "hex")

	FUNCTION = DYNANIC

		pre node: msg.payload = {id: 2, fn:3, addr: 4, count: 5}
		
	FUNCTION = OTHER 
	
		use GUI:
		
		msg.payload = {id:2, fn: 3, addr: 4, count: 5}

## Changelog

- 1.0.0: initial release
- 1.0.1 .. 1.0.11: fix bug

## TODO


