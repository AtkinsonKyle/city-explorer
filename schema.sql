DROP TABLE weather;
CREATE TABLE weather (
  id SERIAL PRIMARY KEY,
);

DROP TABLE location;
CREATE TABLE location (
  id SERIAL PRIMARY KEY,
  latitude FLOAT,
  longitude FLOAT
);

DROP TABLE trails;
CREATE TABLE trails (
  id SERIAL PRIMARY KEY,
  length_ FLOAT,
  stars FLOAT
);