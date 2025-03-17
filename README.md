# A* Algorithm Visualization

Ovaj projekat omogućava vizualizaciju A* algoritma za pretragu puta kroz lavirint. Aplikacija omogućava korisnicima da prate kretanje algoritma u stvarnom vremenu, birajući različite heuristike za računanje puta. Takođe, korisnici mogu dinamički menjati lavirint dodajući ili uklanjajući zidove pomoću jednostavnog interfejsa.

## Funkcionalnosti

- Vizualizacija A* algoritma u realnom vremenu.
- Podrška za četiri različite heuristike:
  - **Manhattan**: Suma apsolutnih razlika između x i y koordinata.
  - **Euclidean**: Stvarna udaljenost između tačaka (Pitagorina teorema).
  - **Chebyshev**: Maksimalna apsolutna razlika između x i y koordinata.
  - **Diagonal**: Slična Manhattan heuristici, ali sa podrškom za dijagonalno kretanje.
- Interaktivni lavirint gde korisnici mogu dodavati ili uklanjati zidove klikom na kockice.
- Dinamičko praćenje broja koraka i vremena izvršenja algoritma.
- Prikaz objašnjenja za svaku heuristiku.

## Instalacija

Da biste pokrenuli ovaj projekat lokalno, pratite sledeće korake:

### 1. Kloniranje repozitorijuma

```bash
git clone https://github.com/vas-username/a-star-visualization.git
cd a-star-visualization
```

### 2. Instalacija zavisnosti

Za instalaciju zavisnosti, koristite npm ili yarn:

```bash 
npm install
```

ili 

```bash
yarn install
```

## 3. Pokretanje aplikacije

Pokrenite aplikaciju na lokalnoj mašini:
```bash 
npm start
```


ili
```bash 
yarn start
```


## Kako koristiti

-  **Izaberite heuristiku**: U padajućem meniju izaberite jednu od četiri dostupne heuristike (Manhattan, Euclidean, Chebyshev, Diagonal).
  
- **Kreirajte lavirint**: Klikom na kocke možete dodavati ili uklanjati zidove, čime kreirate lavirint.
- **Pokrenite A algoritam**: Kliknite na dugme "Pokreni A* algoritam" da biste započeli pretragu puta. Aplikacija će prikazati korake i putanju kroz lavirint.
- **Pratite rezultate**: Na ekranu ćete videti vreme izvršavanja i broj koraka potrebnih za pronalaženje puta.


## Tehnologije

- **React**: 
Za izgradnju interaktivnog korisničkog interfejsa.
- **Canvas API**: 
Za crtanje lavirinta i vizualizaciju algoritma.
- **JavaScript**: 
Za implementaciju logike A* algoritma i povezivanje sa UI-jem.

## Planovi za budućnost

- Dodavanje podrške za više vrsta algoritama (npr. Dijkstra, BFS).
- Unapređenje vizualnih efekata za bolje iskustvo korisnika.
- Optimizacija performansi za veće lavirinte.
