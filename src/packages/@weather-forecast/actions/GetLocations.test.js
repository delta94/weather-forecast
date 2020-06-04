import axios from 'axios';
import { call, put } from 'redux-saga/effects';
import GetLocations from './GetLocations';
import { setLocations, setLoading, setError } from './index';
import { GET_LOCATIONS } from '../constants';

describe('call action GetLocations', () => {
    let gen

    const testBeforeFetch = () => {
        expect(gen.next().value).toEqual(put(setLocations(undefined)))
        expect(gen.next().value).toEqual(put(setLoading(GET_LOCATIONS, true)))
        expect(gen.next().value).toEqual(put(setError(GET_LOCATIONS, undefined)))
    }
    const testFinal = () => {
        expect(gen.next().value).toEqual(put(setLoading(GET_LOCATIONS, false)))
    };

    const testReturn = () => {
        expect(gen.next()).toEqual({ value: undefined, done: true })
    }

    test('with empty query', () => {
        gen = GetLocations({ type: GET_LOCATIONS, payload: '' });
        testBeforeFetch();
        testFinal();
        testReturn()
    })

    test('with fetch error', () => {
        const query = 'ho cho minh'
        gen = GetLocations({ type: GET_LOCATIONS, payload: query });
        testBeforeFetch();
        expect(gen.next().value).toEqual(call(axios, {
            url: `/api/location/search/`,
            params: { query }
        }));
        const e = new Error('Network Error')
        expect(gen.throw(e).value).toEqual(put(setError(GET_LOCATIONS, e.message)));
        testFinal();
        testReturn()
    })

    test('with query = "ho chi minh" ', () => {
        const query = 'ho cho minh'
        gen = GetLocations({ type: GET_LOCATIONS, payload: query });
        testBeforeFetch();
        expect(gen.next().value).toEqual(call(axios, {
            url: `/api/location/search/`,
            params: { query }
        }));
        const resp = {
            data: [{
                title: "San Francisco",
                location_type: "City",
                woeid: 2487956,
                latt_long: "37.777119, -122.41964"
            }]
        }

        const locations = [{
            id: 2487956,
            title: 'San Francisco',
            type: 'City',
            lattLong: '37.777119, -122.41964'
        }];
        expect(gen.next(resp).value).toEqual(put(setLocations(locations)));
        testFinal();
        testReturn();
    })
})