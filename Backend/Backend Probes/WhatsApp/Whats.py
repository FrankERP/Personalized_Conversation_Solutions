from twilio.rest import Client
from time import sleep

# Find your Account SID and Auth Token at twilio.com/console
# and set the environment variables. See http://twil.io/secure
account_sid = 'AC65258811a65fb4d17d9d1c271cd31dec'
auth_token = '8e71dcd03bf4860e34f73bb3cd44751c'
client = Client(account_sid, auth_token)

message = client.messages.create(
                              body='Hola',
                              from_='whatsapp:+14155238886',
                              to='whatsapp:+5215559601318'
                              )
sleep(1)

some_messages = client.messages.list(limit=1)
# client.messages.get
for m in some_messages:
    print(m.body)