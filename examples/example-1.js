[
    {
        "id": "40ab7c24597e24d6",
        "type": "modbus_rtu",
        "z": "2b535346fadd97c6",
        "slave_id": "7",
        "fn": "-1",
        "addr": "8",
        "count": "9",
        "x": 780,
        "y": 260,
        "wires": [
            [
                "51c08ea65917c4fd"
            ]
        ]
    },
    {
        "id": "57e69d4db547e69c",
        "type": "inject",
        "z": "2b535346fadd97c6",
        "name": "",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "",
        "payloadType": "date",
        "x": 400,
        "y": 260,
        "wires": [
            [
                "fd36733c93672c41"
            ]
        ]
    },
    {
        "id": "fd36733c93672c41",
        "type": "function",
        "z": "2b535346fadd97c6",
        "name": "function 1",
        "func": "msg.payload = Buffer.from('010300040001', \"hex\")\nmsg.payload={id:5, fn:6, addr:7, count:8}\nreturn msg;",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 560,
        "y": 260,
        "wires": [
            [
                "40ab7c24597e24d6"
            ]
        ]
    },
    {
        "id": "51c08ea65917c4fd",
        "type": "debug",
        "z": "2b535346fadd97c6",
        "name": "debug 1",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "statusVal": "",
        "statusType": "auto",
        "x": 1020,
        "y": 260,
        "wires": []
    }
]