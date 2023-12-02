import { DataBase } from "../../../app/server_app/data/DataBase";
import * as IdGenerator from "../../../app/server_app/data/IdGenerator";


type typeWithId = {
    id: string,
    name: string,
    color: string
}

describe.only('Database test suites', ()=>{
    let sut: DataBase<typeWithId>;
    const fakeId = '12345';

    const dummyObj1 = {
        id: '',
        name: 'test1',
        color: 'Red'
    }
    const dummyObj2 = {
        id: '',
        name: 'test2',
        color: 'Red'
    }
    beforeEach(()=> {
        sut = new DataBase<typeWithId>();
        //Here this spyOn modify the behaviour of the function and make it return id 12345 instead of 1234
        jest.spyOn(IdGenerator, 'generateRandomId').mockReturnValue(fakeId);
    })

    it('Should return id after insert', async ()=>{
        const actualId = await sut.insert({
            id: '1234',
            // name: 'test',
            // color: 'Red'
        } as any)     
        
        expect(actualId).toBe(fakeId)
    })

    it('Should get element after insert', async ()=>{
        const id = await sut.insert(dummyObj1);
        const actual = await sut.getBy('id', id);

        expect(actual).toBe(dummyObj1)
    })

    it('Should find all elements with the same property', async () => {
        const color = 'Red';
        await sut.insert(dummyObj1);
        await  sut.insert(dummyObj2);
        const expectedArray = [ dummyObj1, dummyObj2 ]

        const actual = await sut.findAllBy('color', color);
        expect(actual).toEqual(expectedArray);
    })

    it('Should update element', async ()=>{
        const id = await sut.insert(dummyObj1);
        // Update the name to be test3
        const expectedName = 'test3';
        await sut.update(id, 'name', expectedName);
        const actual = await sut.getBy('id', id);
        expect(actual.name).toBe(expectedName);
        // expect(actual).toEqual({
        //     id,
        //     name: 'test3',
        //     color: 'Red'
        // })
    })

    it('Should delete element', async ()=>{
        const id = await sut.insert(dummyObj1);
        await sut.delete(id);
        const actual = await sut.getBy('id', id);
        expect(actual).toBeUndefined();
    })

    it('Should get all elements', async ()=>{
        await sut.insert(dummyObj1);
        await sut.insert(dummyObj2);
        const actualAllObjects = await sut.getAllElements();
        const expectedObjects = [ dummyObj1, dummyObj2 ];
        expect(actualAllObjects).toEqual(expectedObjects);
    })
})