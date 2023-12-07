import { generateRandomId } from "../../../app/server_app/data/IdGenerator"

describe('Id Generator test suites', () => {

    it('It should be generate random id string with length 20', () => {
        const randomId = generateRandomId();
        expect(randomId.length).toBe(20);
    })
})