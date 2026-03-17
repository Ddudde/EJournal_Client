import StatusStore from "../store/StatusStore";
import {test, expect, describe} from "vitest";

describe('My first describe', () => {
    test('My first test', () => {
        let test1 = new StatusStore();
        test1.stateReset();
        expect(Math.max(1, 5, 10)).toBe(10);
    });
});