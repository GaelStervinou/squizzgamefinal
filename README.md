## Getting Started

## Put all migrations in the migrations folder
```
docker-compose up -d
````

## Run migrations inside the api container
```
npm run migration:run
```

## Remove the migrations from the migration folder

## You can use the project




## Fonctionnalités

Se connecter ou créer un utilisateur ( bien choisir son role)
- La partie authentification a été faite par Louis-Antoine

- En tant que teacher, je peux créer des quizz (Louis-Antoine)
- En tant que teacher, je peux créer des questions (Rui)
- En tant que teacher, je peux créer des réponses (Rui)
- En tant que teacher, je peux créer des rooms (Rui)
- En tant que teacher, je peux voir les résultats des rooms (Gael)

- En tant que student, je peux aprticiper à un quizz en mettant l'id et le mot de passe (Gael)
- En tant que student, je peux voir mes résultats (Gael)


Diverses fonctionnalités supplémentaires ont été ajoutées, comme le temps par question, une limitation du nombre de users par quizz...
mais surtout une gestion des roles via le token de l'utilisateur, aussi bien en http qu'en websocket. Cela permet de récupérer le user qui fait la requête
de manière automatique, et de vérifier si il a les droits pour faire la requête.


Cependant, la fonctionnalité de questions aléatoires n'est pas complètement terminées.


Ce projet a été réalisé par Louis-Antoine, Rui et Gael. Il est loin d'être complet et parfait, mais nous avons quand même tout réalisé
en pair programming afin d'avoir une bonne maîtrise globale du sujet, pensant qu'une soutenance allait avoir lieu.
