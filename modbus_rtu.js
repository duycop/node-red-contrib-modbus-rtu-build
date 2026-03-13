module.exports = function(RED) {
    function MODBUS_Node(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        
        function ModbusMsg(slaveAddress, functionCode, addressRegister, numberRegisters) {
			var payloadBuffer = Buffer.allocUnsafe(6); // Tăng kích thước payloadBuffer lên 6 byte để chứa cả slaveAddress
			payloadBuffer.writeUInt8(slaveAddress, 0); // Ghi slaveAddress vào vị trí đầu tiên của payloadBuffer
			payloadBuffer.writeUInt8(functionCode, 1); // Ghi functionCode vào vị trí thứ hai của payloadBuffer
			payloadBuffer.writeUInt16BE(addressRegister, 2); // Ghi addressRegister vào vị trí thứ ba của payloadBuffer
			payloadBuffer.writeUInt16BE(numberRegisters, 4); // Ghi numberRegisters vào vị trí thứ năm của payloadBuffer
			return payloadBuffer;
		}
		
		function add_crc(payload, out_crc){
			const talbeAbs = [
			    0x0000, 0xCC01, 0xD801, 0x1400, 0xF001, 0x3C00, 0x2800, 0xE401,
			    0xA001, 0x6C00, 0x7800, 0xB401, 0x5000, 0x9C01, 0x8801, 0x4400
			];
			function crc16(buf) {
			    let crc = 0xFFFF;
			    for (let i = 0; i < buf.length; i++) {
			        let ch = buf[i];
			        crc = talbeAbs[(ch ^ crc) & 15] ^ (crc >> 4);
			        crc = talbeAbs[((ch >> 4) ^ crc) & 15] ^ (crc >> 4);
			    }
			    return crc;
			}
			var crc = crc16(payload);
			var crcBuffer = Buffer.alloc(2); // Allocate a buffer to hold CRC (2 bytes)
			crcBuffer.writeUInt16LE(crc, 0); // Write CRC value into the buffer (little-endian)
			out_crc.crc = crcBuffer;
			// Concatenate payload buffer and CRC buffer
			var newPayload = Buffer.concat([payload, crcBuffer]);
			return newPayload;
		}
		

        node.on('input', function(msg) {
            var fn = parseInt(config.fn);
            var data = []
            if(fn==-1)fn = parseInt(msg.payload.fn);
			if(fn > 0){
				var id =  parseInt(config.slave_id || msg.payload.id);
				if(id=='' || id==0)id = parseInt(msg.payload.id);
				if(id<1 || id>255){
					node.status({fill: "red", shape: "ring", text: 'error: id not in 1..255'});
					node.warn('error: id not in 1..255');
					node.send(msg);
					return;
				}
            	var addr = parseInt(config.addr || msg.payload.addr);
            	if(addr=='' || addr==0)addr = parseInt(msg.payload.addr);
            	if(addr<0){
            		node.status({fill: "red", shape: "ring", text: "error: addr < 0"});
					node.warn('error: addr < 0');
					node.send(msg);
					return;
				}
				var count = parseInt(config.count || msg.payload.count);
				if(count=='' || count==0)count = parseInt(msg.payload.count);
				if(count<1){
					node.status({fill: "red", shape: "ring", text: "error: count < 1"});
					node.warn('error: count < 1');
					node.send(msg);
					return;
				}
	            data = ModbusMsg(id, fn, addr, count);
				var out_crc={crc:"ab"};
	            msg.payload = add_crc(data, out_crc);
	            node.status({fill:"green",shape:"dot",text:`ModbusRTU(${id},${fn},${addr},${count})`});
			}else if(fn==0){
				data = msg.payload;
				var out_crc={crc:"ab"};
	            msg.payload = add_crc(data, out_crc);
				node.status({fill:"green",shape:"dot",text:"Add CRC16: "+out_crc.crc[0]+' '+out_crc.crc[1]});
			}
			node.send(msg);
        });
    }

    RED.nodes.registerType("Modbus RTU", MODBUS_Node, {});
}