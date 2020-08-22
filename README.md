# roborahman

Purpose: Remote Controlled Robot for rahman.

## Important Details
API IPv4: http://103.4.235.66/
GET Request: http://103.4.235.66/api/RobotInstruction/1
PUT Request: http://103.4.235.66/api/RobotInstruction/1

------------------------------------------------
DATA FORMAT:
{
	"id": 1, /* Always One */
	"direction": [1 - 3], /* Will Accept Any Integer, PUT in 1 for Left, 2 for Forward, 3 for Right */
	"turn": [0 - 1], /* Producer is 0, Consumer is 1 again PUT request it in. */
}

Note: DO NOT POST, it will just add another entry because its just a database haha


## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```
