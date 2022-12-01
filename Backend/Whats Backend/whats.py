from twilio.rest import Client
from time import sleep

def auth():
    # Find your Account SID and Auth Token at twilio.com/console
    # and set the environment variables. See http://twil.io/secure
    account_sid = 'ACc1ef8ec034e9a8ad279bd87a267d0f27'
    auth_token = 'ad65d8041c98e02a8e82f23400d1d81c'
    client = Client(account_sid, auth_token)
    return client

def getPhone():
    with open('phoneNumber.txt','r') as attr:
                data = attr.read()
                phoneNumber = data.split('\n')[0]
                attr.close()
    return phoneNumber

def send(body):
    client = auth()
    phoneNumber = getPhone()
    m = client.messages.create(
                        body=body,
                        from_='whatsapp:+14155238886',
                        to='whatsapp:%s' % phoneNumber
                        )
    pass

def receive():
    client = auth()
    antMsg = client.messages.list(limit=1)
    while True:
        Msg = client.messages.list(limit=1)
        if antMsg[0].body != Msg[0].body:
            return Msg[0].body
        else:
            antMsg = Msg
        sleep(1)

if __name__ == '__main__':
    print(type(receive()))