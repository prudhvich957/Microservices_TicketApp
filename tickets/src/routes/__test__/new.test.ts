import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

//jest.mock('../../nats-wrapper');

it('has a route handler to /api/tickets for post requests', async () => {

    const response = await request(app).post('/api/tickets').send({});
    expect(response.status).not.toEqual(404);

})

it('can only be accessed if the user is signed in', async () => {
    await request(app).post('/api/tickets').send({}).expect(401);
})

it('returns a status other than 401 if the user is signed in', async () => {

    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin()).send({});

    expect(response.status).not.toEqual(401);
})

it('returns an error if an invalid title is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: '',
            price: 10
        }).expect(400);
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            price: 10
        }).expect(400);

})

it('returns an error if invalid price is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'title',
            price: -10
        }).expect(400);
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: ''
        }).expect(400);
})

it('create a ticket with valid inputs', async () => {

    let tickets = await Ticket.find({});
   expect(tickets.length).toEqual(0);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'ticket',
            price: '12'
        }).expect(201);
    
    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(12);
})

it('publishes an event', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'ticket',
            price: '12'
        }).expect(201);

    console.log(natsWrapper);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})