-> return to [README.md](../README.md)
# Customize the config files

  - 1. administrators.json
This file contains the list of administrators of the bot. You can add or remove administrators by adding or removing the telegram username in the list. Administrators can manage the whitelist of mentors.

  - 2. profile.json
This file contains the list of questions to ask to the users when they fill their profile. You can add or remove questions by adding or removing the question in the list. The questions are asked in the order they are in the list.

The object contain 3 main fields:
```json	
{
  "fields": [],
  "mentorFields": [],
  "menteeFields": []
}
```
First, the bot will ask common questions to both mentors and mentees. Then, it will ask specific questions to mentors and mentees. The questions are asked in the order they are in the list.

To add a question, add a new object in the list with the following fields:
```json	
{
  "name": "the_field_name",
  "label": "📙 A more stylish name",
  "type": "string",
  "required": true,
  "id": 45
}
```

The name will be used to identify the question in a more human-readable way.

The label will be displayed on the user profile.

The id must be unique and is used to identify the question in the database.

Type can be "string", "number", "boolean", "[topics](#topics)", "stringArray".

You can update name, label, type, and required fields without breaking the database, but you should only change the id if you know what you are doing.

Some optional fields can be added:
```json	
{
  "question": "What is your favorite color?",
}
```
By default the question is generated using the label, with "Please enter your " + label. You can override this behavior by adding the question field.

```json	
{
  "expectedAnswer": ["red", "blue", "green"],
}
```
The expectedAnswer field is used to validate the user input. If the user input is not in the list, the bot will ask the question again.

```json	
{
  "matchingField": "field_name",
}
```
This option has to be set in mentorFields. The bot will find the corresponding provided field in menteeFields to match mentors and mentees. It currently only support stringArray or topics type. The algorithm will match mentors and mentees who have more common values.

```json	
{
  "regex": "^[a-zA-Z0-9]{5,30}$",
}
```
The regex field is used to validate the user input. If the user input does not match the regex, the bot will ask the question again.

```json	
{
  "isUserTypeField": true,
}
```
This should be set only in one field. It must be a common field. The bot will use this field to determine if the user is a mentor or a mentee. The value of this field must be "mentor" or "mentee". The bot will ask the specific questions to the user based on this field.

  - 3. topics.json
This file contains the list of topics that the users can choose from. You can add or remove topics by adding or removing the topic in the list.

The object contain 3 main fields:
```json	
{
  "id": 0,
  "name": "the_topic_name",
  "label": "📙 A more stylish name"
}
```

The label will be displayed on the user profile.

This is the name that will be entered by the user during the setup, as it is more likely to be more user-friendly than the id or the label. Then, the id is used to identify the topic in the database, so you can change the label and the name without breaking the database, but you should only change the id if you know what you are doing.