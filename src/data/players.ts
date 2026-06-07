import type { Player } from '../types';

// Structured data for easy roster management - 24 players per squad
const SQUADS: Record<string, Record<string, { names: string[], positions: string[][], ratings: number[] }>> = {
  '1990s': {
    'Real Madrid': {
      names: ['Raúl', 'Fernando Redondo', 'Fernando Hierro', 'Roberto Carlos', 'Bodo Illgner', 'Christian Panucci', 'Davor Šuker', 'Clarence Seedorf', 'Manuel Sanchís', 'Steve McManaman', 'Iván Zamorano', 'Guti', 'Fernando Morientes', 'Aitor Karanka', 'Manolo Sanchís', 'Víctor Sánchez', 'Jaime Sánchez', 'Pedro Jaro', 'Álvaro Benito', 'Javi Navarro', 'Dani García', 'José Emilio Amavisca', 'Perica Ognjenović', 'Iván Campo'],
      positions: [['ST', 'CAM'], ['CM', 'CDM'], ['CB', 'CM'], ['LB'], ['GK'], ['RB'], ['ST'], ['CM'], ['CB'], ['RM', 'LM'], ['ST'], ['CAM', 'CM'], ['ST'], ['CB'], ['CB'], ['RW'], ['CDM'], ['GK'], ['LW'], ['CB'], ['ST'], ['LW'], ['LW'], ['CB']],
      ratings: [92, 91, 90, 91, 88, 87, 89, 90, 88, 89, 89, 86, 85, 84, 84, 83, 83, 82, 82, 82, 81, 81, 81, 80]
    },
    'AC Milan': {
      names: ['Paolo Maldini', 'Franco Baresi', 'Marco van Basten', 'Marcel Desailly', 'Dejan Savićević', 'George Weah', 'Demetrio Albertini', 'Sebastiano Rossi', 'Ruud Gullit', 'Frank Rijkaard', 'Alessandro Costacurta', 'Mauro Tassotti', 'Roberto Donadoni', 'Zvonimir Boban', 'Christian Panucci', 'Massimo Ambrosini', 'Jean-Pierre Papin', 'Brian Laudrup', 'Stefano Eranio', 'Filippo Galli', 'Daniele Massaro', 'Marco Simone', 'Ibrahim Ba', 'Jens Lehmann'],
      positions: [['CB', 'LB'], ['CB'], ['ST'], ['CB', 'CDM'], ['CAM', 'RW'], ['ST'], ['CDM', 'CM'], ['GK'], ['CAM', 'ST'], ['CDM', 'CB'], ['CB'], ['RB'], ['RM', 'LM'], ['CAM'], ['RB'], ['CDM'], ['ST'], ['LW', 'RW'], ['RM'], ['CB'], ['ST'], ['ST'], ['RM'], ['GK']],
      ratings: [97, 96, 95, 94, 92, 93, 90, 89, 94, 93, 90, 88, 88, 89, 87, 87, 87, 86, 86, 85, 85, 85, 84, 83]
    },
    'Man United': {
      names: ['Eric Cantona', 'Peter Schmeichel', 'Roy Keane', 'Ryan Giggs', 'David Beckham', 'Paul Scholes', 'Gary Neville', 'Jaap Stam', 'Andy Cole', 'Teddy Sheringham', 'Ole Gunnar Solskjær', 'Denis Irwin', 'Phil Neville', 'Nicky Butt', 'Ronny Johnsen', 'Henning Berg', 'Jesper Blomqvist', 'Dwight Yorke', 'Mark Hughes', 'Steve Bruce', 'Brian McClair', 'Paul Ince', 'Lee Sharpe', 'Raimond van der Gouw'],
      positions: [['ST', 'CAM'], ['GK'], ['CDM', 'CM'], ['LM', 'LW'], ['RM', 'RW'], ['CM', 'CAM'], ['RB'], ['CB'], ['ST'], ['ST', 'CAM'], ['ST'], ['LB'], ['RB', 'LB'], ['CM', 'CDM'], ['CB'], ['CB'], ['LM'], ['ST'], ['ST'], ['CB'], ['ST', 'CAM'], ['CM', 'CDM'], ['LM'], ['GK']],
      ratings: [93, 95, 92, 91, 90, 91, 88, 92, 90, 89, 88, 88, 87, 87, 86, 86, 85, 90, 85, 85, 84, 86, 84, 80]
    },
    'Juventus': {
      names: ['Alessandro Del Piero', 'Zinedine Zidane', 'Gianluca Vialli', 'Didier Deschamps', 'Ciro Ferrara', 'Fabrizio Ravanelli', 'Antonio Conte', 'Angelo Peruzzi', 'Filippo Inzaghi', 'Edgar Davids', 'Paolo Montero', 'Gianluca Pessotto', 'Alessio Tacchinardi', 'Angelo Di Livio', 'Vladimir Jugović', 'Attilio Lombardo', 'Moreno Torricelli', 'Pietro Vierchowod', 'Salvatore Fresi', 'Michelangelo Rampulla', 'Zoran Mirković', 'Juan Esnáider', 'Daniel Fonseca', 'Jocelyn Blanchard'],
      positions: [['ST', 'CF'], ['CAM'], ['ST'], ['CDM', 'CM'], ['CB'], ['ST'], ['CM', 'CDM'], ['GK'], ['ST'], ['CDM', 'CM'], ['CB'], ['LB', 'RB'], ['CDM', 'CB'], ['RM', 'LM'], ['CM', 'LM'], ['RM', 'RW'], ['RB', 'CB'], ['CB'], ['CB'], ['GK'], ['RB', 'CB'], ['ST'], ['ST', 'LW'], ['CM']],
      ratings: [94, 96, 91, 92, 90, 89, 88, 90, 89, 91, 89, 87, 86, 87, 87, 86, 86, 88, 83, 82, 83, 83, 84, 80]
    },
    'Ajax': {
      names: ['Jari Litmanen', 'Patrick Kluivert', 'Clarence Seedorf', 'Edgar Davids', 'Frank de Boer', 'Ronald de Boer', 'Edwin van der Sar', 'Danny Blind', 'Marc Overmars', 'Finidi George', 'Michael Reiziger', 'Winston Bogarde', 'Nwankwo Kanu', 'Kiki Musampa', 'Nordin Wooter', 'Peter van Vossen', 'Fred Grim', 'Sonny Silooy', 'Tarik Oulida', 'Martijn Reuser', 'John van den Brom', 'Michel Kreek', 'Clyde Wijnhard', 'Raymond Beerens'],
      positions: [['CAM', 'ST'], ['ST'], ['CM', 'RM'], ['CDM', 'CM'], ['CB', 'LB'], ['RM', 'CM', 'ST'], ['GK'], ['CB', 'SW'], ['LW', 'LM'], ['RW', 'RM'], ['RB'], ['LB', 'CB'], ['ST', 'CF'], ['LW', 'LM'], ['RW', 'ST'], ['ST', 'LW'], ['GK'], ['RB', 'CB'], ['CAM'], ['CAM', 'RW'], ['CB', 'CDM'], ['CM', 'LB'], ['ST'], ['GK']],
      ratings: [93, 91, 90, 90, 91, 89, 92, 91, 91, 89, 88, 86, 88, 83, 82, 83, 80, 84, 81, 81, 83, 82, 80, 75]
    },
    'Borussia Dortmund': {
      names: ['Matthias Sammer', 'Andreas Möller', 'Karl-Heinz Riedle', 'Stéphane Chapuisat', 'Jürgen Kohler', 'Stefan Klos', 'Stefan Reuter', 'Paul Lambert', 'Paulo Sousa', 'Jörg Heinrich', 'Lars Ricken', 'Michael Zorc', 'Heiko Herrlich', 'Martin Kree', 'Júlio César', 'René Tretschok', 'Knut Reinhardt', 'Wolfgang de Beer', 'Steffen Freund', 'René Schneider', 'Jovan Kirovski', 'Ibrahim Tanko', 'Amadeo Carboni', 'Wolfgang Feiersinger'],
      positions: [['CB', 'CDM'], ['CAM'], ['ST'], ['ST'], ['CB'], ['GK'], ['RB', 'RM'], ['CM', 'CDM'], ['CDM', 'CM'], ['LB', 'LM'], ['CAM', 'RM'], ['CM'], ['ST'], ['CB'], ['CB'], ['LM', 'CM'], ['LB'], ['GK'], ['CDM'], ['CB'], ['ST', 'CAM'], ['ST'], ['LB'], ['CB']],
      ratings: [93, 91, 90, 89, 92, 88, 89, 87, 90, 87, 88, 86, 86, 84, 88, 84, 83, 81, 84, 82, 80, 81, 85, 83]
    }
  },
  '2000s': {
    'Barcelona': {
      names: ['Ronaldinho', 'Lionel Messi', 'Xavi', 'Carles Puyol', 'Andrés Iniesta', 'Dani Alves', 'Victor Valdés', 'Deco', 'Thierry Henry', 'Rafael Márquez', 'Giovanni van Bronckhorst', 'Samuel Eto\'o', 'Gerard Piqué', 'Yaya Touré', 'Eric Abidal', 'Pedro', 'Bojan Krkić', 'Sylvinho', 'Mark van Bommel', 'Henrik Larsson', 'Ludovic Giuly', 'Edmílson', 'Gianluca Zambrotta', 'Albert Jorquera'],
      positions: [['CAM', 'LW', 'RW'], ['RW', 'CAM', 'ST'], ['CM'], ['CB', 'RB'], ['CM', 'CAM', 'LW'], ['RB'], ['GK'], ['CM', 'CAM'], ['LW', 'ST'], ['CB', 'CDM'], ['LB'], ['ST'], ['CB'], ['CDM'], ['LB'], ['LW', 'RW'], ['ST'], ['LB'], ['CM'], ['ST'], ['RW'], ['CB', 'CDM'], ['RB', 'LB'], ['GK']],
      ratings: [97, 95, 94, 93, 92, 93, 89, 91, 92, 89, 88, 93, 88, 89, 87, 87, 86, 86, 86, 86, 85, 85, 85, 80]
    },
    'Chelsea': {
        names: ['Frank Lampard', 'John Terry', 'Didier Drogba', 'Petr Čech', 'Claude Makélélé', 'Ashley Cole', 'Michael Essien', 'Joe Cole', 'Ricardo Carvalho', 'Michael Ballack', 'Andriy Shevchenko', 'Arjen Robben', 'Hernán Crespo', 'Paulo Ferreira', 'Wayne Bridge', 'Carlo Cudicini', 'Geremi', 'Glen Johnson', 'William Gallas', 'Damien Duff', 'Tiago', 'Salomon Kalou', 'Juliano Belletti', 'Alex'],
        positions: [['CAM', 'CM'], ['CB'], ['ST'], ['GK'], ['CDM'], ['LB'], ['CDM', 'CM'], ['CAM', 'RW'], ['CB'], ['CM'], ['ST'], ['RW', 'LW'], ['ST'], ['RB'], ['LB'], ['GK'], ['RB', 'RM'], ['RB'], ['CB', 'LB'], ['LW'], ['CM'], ['ST', 'LW'], ['RB'], ['CB']],
        ratings: [94, 93, 92, 93, 92, 91, 90, 88, 91, 90, 88, 90, 89, 87, 86, 85, 85, 84, 84, 88, 87, 92, 86, 84]
    },
    'Man United': {
      names: ['Cristiano Ronaldo', 'Wayne Rooney', 'Paul Scholes', 'Rio Ferdinand', 'Nemanja Vidić', 'Edwin van der Sar', 'Ryan Giggs', 'Ruud van Nistelrooy', 'Michael Carrick', 'Patrice Evra', 'Gary Neville', 'Park Ji-sung', 'Darren Fletcher', 'Carlos Tevez', 'Louis Saha', 'Wes Brown', 'John O\'Shea', 'Tomasz Kuszczak', 'Owen Hargreaves', 'Nani', 'Anderson', 'Mikaël Silvestre', 'Alan Smith', 'Kieran Richardson'],
      positions: [['ST', 'LW'], ['ST', 'CAM'], ['CM'], ['CB'], ['CB'], ['GK'], ['LM', 'LW'], ['ST'], ['CDM', 'CM'], ['LB'], ['RB'], ['LM', 'RM'], ['CM'], ['ST'], ['ST'], ['CB', 'RB'], ['RB', 'LB', 'CDM'], ['GK'], ['CDM'], ['RW'], ['CAM'], ['CB', 'LB'], ['ST', 'CDM'], ['LM']],
      ratings: [94, 91, 92, 92, 91, 93, 90, 92, 89, 90, 88, 87, 86, 90, 86, 85, 85, 82, 86, 87, 85, 84, 84, 80]
    },
    'Liverpool': {
      names: ['Steven Gerrard', 'Jamie Carragher', 'Xabi Alonso', 'Fernando Torres', 'Sami Hyypiä', 'Pepe Reina', 'John Arne Riise', 'Luis García', 'Dietmar Hamann', 'Javier Mascherano', 'Dirk Kuyt', 'Robbie Fowler', 'Peter Crouch', 'Harry Kewell', 'Djibril Cissé', 'Daniel Agger', 'Álvaro Arbeloa', 'Steve Finnan', 'Jerzy Dudek', 'Momo Sissoko', 'Fábio Aurélio', 'Yossi Benayoun', 'Ryan Babel', 'Lucas Leiva'],
      positions: [['CM', 'CAM'], ['CB'], ['CM', 'CDM'], ['ST'], ['CB'], ['GK'], ['LB', 'LM'], ['CAM', 'RW'], ['CDM'], ['CDM', 'CB'], ['RW', 'ST'], ['ST'], ['ST'], ['LM', 'LW'], ['ST'], ['CB'], ['RB', 'LB'], ['RB'], ['GK'], ['CDM'], ['LB', 'LM'], ['RM', 'CAM'], ['LW', 'ST'], ['CM']],
      ratings: [95, 89, 91, 92, 89, 90, 87, 86, 86, 89, 86, 85, 85, 86, 85, 86, 85, 85, 84, 84, 83, 84, 83, 82]
    },
    'AC Milan': {
      names: ['Kaká', 'Andriy Shevchenko', 'Andrea Pirlo', 'Clarence Seedorf', 'Gennaro Gattuso', 'Filippo Inzaghi', 'Alessandro Nesta', 'Paolo Maldini', 'Dida', 'Cafu', 'Jaap Stam', 'Massimo Ambrosini', 'Rui Costa', 'Serginho', 'Jon Dahl Tomasson', 'Hernán Crespo', 'Alessandro Costacurta', 'Kakha Kaladze', 'Marek Jankulovski', 'Christian Abbiati', 'Dario Šimić', 'Alberto Gilardino', 'Yoann Gourcuff', 'Cristian Brocchi'],
      positions: [['CAM'], ['ST'], ['CM', 'CDM'], ['CM', 'CAM'], ['CDM', 'CM'], ['ST'], ['CB'], ['CB', 'LB'], ['GK'], ['RB'], ['CB'], ['CDM', 'CM'], ['CAM'], ['LB', 'LM'], ['ST'], ['ST'], ['CB'], ['CB', 'LB'], ['LB', 'LM'], ['GK'], ['CB', 'RB'], ['ST'], ['CAM'], ['CM']],
      ratings: [96, 94, 93, 92, 90, 91, 94, 95, 89, 92, 91, 87, 90, 87, 86, 89, 86, 86, 85, 83, 84, 86, 82, 81]
    },
    'Arsenal': {
      names: ['Thierry Henry', 'Robert Pires', 'Patrick Vieira', 'Sol Campbell', 'Ashley Cole', 'Jens Lehmann', 'Dennis Bergkamp', 'Freddie Ljungberg', 'Gilberto Silva', 'Kolo Touré', 'Lauren', 'Cesc Fàbregas', 'Robin van Persie', 'José Antonio Reyes', 'Emmanuel Eboué', 'Philippe Senderos', 'Aleksandr Hleb', 'Mathieu Flamini', 'Manuel Almunia', 'Gaël Clichy', 'Pascal Cygan', 'Johan Djourou', 'Jeremie Aliadiere', 'Quincy Owusu-Abeyie'],
      positions: [['ST', 'LW'], ['LM', 'LW'], ['CM', 'CDM'], ['CB'], ['LB'], ['GK'], ['CF', 'CAM'], ['RM', 'RW'], ['CDM'], ['CB'], ['RB'], ['CM', 'CAM'], ['ST'], ['LW', 'ST'], ['RB', 'RM'], ['CB'], ['CAM', 'RM'], ['CDM', 'CM'], ['GK'], ['LB'], ['CB'], ['CB'], ['ST'], ['RW', 'LW']],
      ratings: [96, 92, 93, 91, 91, 89, 90, 89, 88, 88, 86, 87, 86, 86, 84, 83, 85, 84, 80, 83, 79, 78, 77, 75]
    }
  },
  '2010s': {
    'Real Madrid': {
      names: ['Cristiano Ronaldo', 'Luka Modrić', 'Sergio Ramos', 'Karim Benzema', 'Toni Kroos', 'Marcelo', 'Casemiro', 'Keylor Navas', 'Dani Carvajal', 'Gareth Bale', 'Pepe', 'Isco', 'Raphaël Varane', 'Angel Di Maria', 'Iker Casillas', 'Fabio Coentrão', 'Xabi Alonso', 'Mateo Kovačić', 'Lucas Vázquez', 'Nacho', 'Alvaro Morata', 'Asier Illarramendi', 'James Rodríguez', 'Kiko Casilla'],
      positions: [['ST', 'LW'], ['CM', 'CAM'], ['CB'], ['ST'], ['CM', 'CDM'], ['LB'], ['CDM'], ['GK'], ['RB'], ['RW', 'ST'], ['CB'], ['CAM', 'CM'], ['CB'], ['RW', 'CM'], ['GK'], ['LB'], ['CDM'], ['CM'], ['RW', 'RB'], ['CB', 'RB', 'LB'], ['ST'], ['CDM'], ['CAM'], ['GK']],
      ratings: [99, 98, 97, 95, 96, 94, 93, 93, 91, 94, 91, 89, 90, 90, 90, 86, 91, 87, 85, 86, 86, 84, 90, 83]
    },
    'Barcelona': {
      names: ['Lionel Messi', 'Andrés Iniesta', 'Xavi', 'Luis Suárez', 'Jordi Alba', 'Gerard Piqué', 'Sergio Busquets', 'Dani Alves', 'Marc-André ter Stegen', 'Neymar Jr', 'Ivan Rakitic', 'Cesc Fàbregas', 'Pedro', 'Javier Mascherano', 'Alexis Sánchez', 'Claudio Bravo', 'Sergi Roberto', 'Samuel Umtiti', 'Arthur', 'Philippe Coutinho', 'Ousmane Dembélé', 'Arturo Vidal', 'Nelson Semedo', 'Jasper Cillessen'],
      positions: [['RW', 'CAM', 'ST'], ['CM', 'CAM', 'LW'], ['CM'], ['ST'], ['LB'], ['CB'], ['CDM'], ['RB'], ['GK'], ['LW', 'ST'], ['CM'], ['CAM', 'CM'], ['LW', 'RW'], ['CB', 'CDM'], ['RW', 'LW'], ['GK'], ['RB', 'CM'], ['CB'], ['CM'], ['CAM', 'LW'], ['RW', 'LW'], ['CM', 'CDM'], ['RB'], ['GK']],
      ratings: [99, 97, 96, 95, 91, 93, 94, 93, 91, 93, 90, 89, 88, 88, 89, 87, 87, 87, 86, 87, 87, 88, 86, 85]
    },
    'Bayern Munich': {
      names: ['Arjen Robben', 'Franck Ribéry', 'Thomas Müller', 'Manuel Neuer', 'Philipp Lahm', 'Bastian Schweinsteiger', 'Robert Lewandowski', 'David Alaba', 'Jerome Boateng', 'Javi Martínez', 'Toni Kroos', 'Mario Mandžukić', 'Thiago Alcântara', 'Mats Hummels', 'Kingsley Coman', 'Joshua Kimmich', 'Mario Götze', 'Xerdan Shaqiri', 'Dante', 'Holger Badstuber', 'Claudio Pizarro', 'Rafinha', 'Tom Starke', 'Juan Bernat'],
      positions: [['RW', 'RM'], ['LW', 'LM'], ['CAM', 'CF', 'ST'], ['GK'], ['RB', 'CDM'], ['CM', 'CDM'], ['ST'], ['LB', 'CB', 'CM'], ['CB'], ['CDM', 'CB'], ['CM', 'CAM'], ['ST'], ['CM', 'CAM'], ['CB'], ['LW', 'RW'], ['RB', 'CDM', 'CM'], ['CAM'], ['RW', 'LW'], ['CB'], ['CB', 'LB'], ['ST'], ['RB'], ['GK'], ['LB']],
      ratings: [94, 93, 92, 95, 94, 92, 94, 90, 89, 88, 90, 87, 89, 90, 86, 88, 87, 84, 85, 83, 83, 83, 79, 82]
    },
    'Inter Milan': {
      names: ['Wesley Sneijder', 'Diego Milito', 'Samuel Eto\'o', 'Javier Zanetti', 'Esteban Cambiasso', 'Lúcio', 'Walter Samuel', 'Maicon', 'Júlio César', 'Dejan Stanković', 'Thiago Motta', 'Goran Pandev', 'Cristian Chivu', 'Mario Balotelli', 'Iván Córdoba', 'Marco Materazzi', 'Sulley Muntari', 'Davide Santon', 'Ricardo Quaresma', 'Francesco Toldo', 'Patrick Vieira', 'Marko Arnautović', 'McDonald Mariga', 'Paolo Orlandoni'],
      positions: [['CAM', 'LW'], ['ST'], ['ST', 'LW'], ['RB', 'CDM', 'RM'], ['CDM', 'CM'], ['CB'], ['CB'], ['RB'], ['GK'], ['CM', 'CAM'], ['CDM', 'CM'], ['CF', 'RW'], ['LB', 'CB'], ['ST', 'LW'], ['CB'], ['CB'], ['CM'], ['LB', 'RB'], ['RW'], ['GK'], ['CM', 'CDM'], ['ST'], ['CDM'], ['GK']],
      ratings: [94, 92, 93, 91, 90, 91, 90, 92, 91, 88, 87, 86, 86, 86, 85, 84, 85, 83, 84, 82, 85, 81, 80, 76]
    },
    'Atletico Madrid': {
      names: ['Diego Godín', 'Antoine Griezmann', 'Koke', 'Gabi', 'Juanfran', 'Filipe Luís', 'Jan Oblak', 'Thibaut Courtois', 'Diego Costa', 'Arda Turan', 'Miranda', 'José María Giménez', 'Saúl Ñíguez', 'Yannick Carrasco', 'Fernando Torres', 'Tiago', 'Raúl García', 'Mario Mandžukić', 'Oliver Torres', 'Stefan Savić', 'Lucas Hernandez', 'Thomas Partey', 'Miguel Ángel Moyá', 'Ángel Correa'],
      positions: [['CB'], ['ST', 'CAM'], ['CM', 'LM'], ['CDM'], ['RB'], ['LB'], ['GK'], ['GK'], ['ST'], ['LM', 'RM'], ['CB'], ['CB'], ['CM', 'RM'], ['LM', 'LW'], ['ST'], ['CDM'], ['CM', 'ST'], ['ST'], ['CAM'], ['CB'], ['CB', 'LB'], ['CDM'], ['GK'], ['ST', 'RW']],
      ratings: [92, 91, 89, 88, 87, 88, 91, 89, 89, 87, 87, 86, 86, 86, 85, 85, 85, 86, 82, 85, 83, 83, 81, 84]
    },
    'Juventus': {
      names: ['Gianluigi Buffon', 'Giorgio Chiellini', 'Leonardo Bonucci', 'Andrea Pirlo', 'Paul Pogba', 'Arturo Vidal', 'Carlos Tevez', 'Alvaro Morata', 'Claudio Marchisio', 'Andrea Barzagli', 'Stephan Lichtsteiner', 'Patrice Evra', 'Gonzalo Higuaín', 'Paulo Dybala', 'Dani Alves', 'Mario Mandžukić', 'Miralem Pjanić', 'Sami Khedira', 'Alex Sandro', 'Juan Cuadrado', 'Kwadwo Asamoah', 'Marco Storari', 'Neto', 'Simone Padoin'],
      positions: [['GK'], ['CB'], ['CB'], ['CM', 'CDM'], ['CM', 'CAM'], ['CM', 'CDM'], ['ST'], ['ST'], ['CM'], ['CB'], ['RB'], ['LB'], ['ST'], ['CAM', 'CF'], ['RB', 'RW'], ['LW', 'ST'], ['CM'], ['CM', 'CDM'], ['LB'], ['RW', 'RB'], ['LM', 'LB'], ['GK'], ['GK'], ['RB', 'CM']],
      ratings: [93, 92, 91, 90, 91, 89, 90, 86, 88, 88, 86, 85, 90, 89, 89, 86, 88, 85, 86, 86, 83, 80, 81, 78]
    }
  },
  '2020s': {
    'Man City': {
      names: ['Erling Haaland', 'Kevin De Bruyne', 'Rodri', 'Ruben Dias', 'Ederson', 'Bernardo Silva', 'Phil Foden', 'John Stones', 'Kyle Walker', 'Ilkay Gündoğan', 'Jack Grealish', 'Riyad Mahrez', 'Manuel Akanji', 'Nathan Aké', 'Aymeric Laporte', 'João Cancelo', 'Julian Alvarez', 'Oleksandr Zinchenko', 'Ferran Torres', 'Gabriel Jesus', 'Stefan Ortega', 'Rico Lewis', 'Oscar Bobb', 'Matheus Nunes'],
      positions: [['ST'], ['CAM', 'CM'], ['CDM'], ['CB'], ['GK'], ['CAM', 'RW'], ['CAM', 'LW', 'RW'], ['CB', 'CDM'], ['RB'], ['CM'], ['LW'], ['RW'], ['CB'], ['CB', 'LB'], ['CB'], ['LB', 'RB'], ['ST'], ['LB'], ['RW', 'ST'], ['ST'], ['GK'], ['RB'], ['RW'], ['CM']],
      ratings: [97, 97, 96, 93, 92, 94, 93, 91, 90, 90, 88, 88, 88, 87, 87, 87, 87, 85, 85, 85, 84, 84, 82, 82]
    },
    'Real Madrid': {
      names: ['Vinícius Júnior', 'Jude Bellingham', 'Karim Benzema', 'Thibaut Courtois', 'Luka Modrić', 'Toni Kroos', 'Federico Valverde', 'Rodrygo', 'Antonio Rüdiger', 'Éder Militão', 'Dani Carvajal', 'David Alaba', 'Eduardo Camavinga', 'Aurélien Tchouaméni', 'Ferland Mendy', 'Nacho', 'Lucas Vázquez', 'Joselu', 'Brahim Díaz', 'Arda Güler', 'Fran García', 'Kepa Arrizabalaga', 'Andriy Lunin', 'Dani Ceballos'],
      positions: [['LW'], ['CAM', 'CM'], ['ST'], ['GK'], ['CM'], ['CM'], ['CM', 'RW'], ['RW', 'ST'], ['CB'], ['CB'], ['RB'], ['CB', 'LB'], ['CM', 'LB'], ['CDM', 'CB'], ['LB'], ['CB', 'LB'], ['RB', 'RW'], ['ST'], ['CAM', 'RW'], ['CAM'], ['LB'], ['GK'], ['GK'], ['CM']],
      ratings: [95, 94, 94, 94, 91, 90, 91, 89, 90, 89, 89, 88, 88, 88, 85, 84, 84, 83, 84, 82, 81, 82, 83, 81]
    },
    'Chelsea': {
      names: ['N\'Golo Kanté', 'Mason Mount', 'Kai Havertz', 'Thiago Silva', 'Edouard Mendy', 'Antonio Rüdiger', 'Reece James', 'Ben Chilwell', 'Jorginho', 'César Azpilicueta', 'Christian Pulisic', 'Timo Werner', 'Hakim Ziyech', 'Mateo Kovačić', 'Andreas Christensen', 'Kurt Zouma', 'Marcos Alonso', 'Callum Hudson-Odoi', 'Olivier Giroud', 'Tammy Abraham', 'Kepa Arrizabalaga', 'Billy Gilmour', 'Faustino Anjorin', 'Willy Caballero'],
      positions: [['CDM', 'CM'], ['CAM', 'RW'], ['ST', 'CAM'], ['CB'], ['GK'], ['CB'], ['RB', 'RWB'], ['LB', 'LWB'], ['CM', 'CDM'], ['CB', 'RB'], ['LW', 'RW'], ['ST', 'LW'], ['RW', 'CAM'], ['CM'], ['CB'], ['CB'], ['LB', 'LWB'], ['LW', 'RW'], ['ST'], ['ST'], ['GK'], ['CM'], ['CAM'], ['GK']],
      ratings: [92, 88, 87, 89, 89, 88, 88, 86, 88, 86, 85, 84, 84, 86, 84, 83, 83, 81, 83, 81, 81, 78, 74, 75]
    },
    'Bayern Munich': {
      names: ['Robert Lewandowski', 'Thomas Müller', 'Joshua Kimmich', 'Manuel Neuer', 'Alphonso Davies', 'Serge Gnabry', 'Kingsley Coman', 'Leon Goretzka', 'David Alaba', 'Jerome Boateng', 'Thiago Alcântara', 'Benjamin Pavard', 'Ivan Perišić', 'Philippe Coutinho', 'Corentin Tolisso', 'Niklas Süle', 'Lucas Hernandez', 'Javi Martínez', 'Sven Ulreich', 'Michael Cuisance', 'Alvaro Odriozola', 'Joshua Zirkzee', 'Ron-Thorben Hoffmann', 'Jamal Musiala'],
      positions: [['ST'], ['CAM', 'CF'], ['CDM', 'RB'], ['GK'], ['LB', 'LM'], ['RW', 'LW'], ['LW', 'RW'], ['CM', 'CDM'], ['CB', 'LB'], ['CB'], ['CM'], ['RB', 'CB'], ['LM', 'LW'], ['CAM', 'LW'], ['CM'], ['CB'], ['CB', 'LB'], ['CDM', 'CB'], ['GK'], ['CM'], ['RB'], ['ST'], ['GK'], ['CAM', 'LM']],
      ratings: [96, 91, 92, 93, 89, 88, 88, 88, 89, 85, 91, 85, 84, 85, 83, 84, 85, 82, 80, 78, 79, 76, 70, 76]
    },
    'Inter Milan': {
      names: ['Lautaro Martínez', 'Nicolò Barella', 'Hakan Çalhanoğlu', 'Alessandro Bastoni', 'Federico Dimarco덴', 'Denzel Dumfries', 'André Onana', 'Milan Škriniar', 'Stefan de Vrij', 'Francesco Acerbi', 'Marcelo Brozović', 'Henrikh Mkhitaryan', 'Romelu Lukaku', 'Edin Džeko', 'Matteo Darmian', 'Robin Gosens', 'Joaquín Correa', 'Kristjan Asllani', 'Raoul Bellanova', 'Roberto Gagliardini', 'Danilo D\'Ambrosio', 'Samir Handanovič', 'Alex Cordaz', 'Valentin Carboni'],
      positions: [['ST'], ['CM'], ['CM', 'CAM'], ['CB'], ['LB', 'LWB'], ['RB', 'RWB'], ['GK'], ['CB'], ['CB'], ['CB'], ['CDM', 'CM'], ['CM', 'CAM'], ['ST'], ['ST'], ['CB', 'RB'], ['LB', 'LWB'], ['ST', 'CF'], ['CM', 'CDM'], ['RB', 'RM'], ['CM'], ['CB', 'RB'], ['GK'], ['GK'], ['CAM']],
      ratings: [91, 90, 88, 87, 86, 85, 86, 87, 85, 85, 87, 84, 85, 84, 83, 83, 81, 79, 77, 78, 78, 80, 73, 72]
    },
    'Borussia Dortmund': {
      names: ['Jude Bellingham', 'Gregor Kobel', 'Mats Hummels', 'Julian Brandt', 'Marco Reus', 'Nico Schlotterbeck', 'Emre Can', 'Marcel Sabitzer', 'Jadon Sancho', 'Niclas Füllkrug', 'Karim Adeyemi', 'Donyell Malen', 'Ian Maatsen', 'Niklas Süle', 'Julian Ryerson', 'Sébastien Haller', 'Jamie Bynoe-Gittens', 'Salih Özcan', 'Youssoufa Moukoko', 'Felix Nmecha', 'Marius Wolf', 'Alexander Meyer', 'Ramy Bensebaini', 'Marcel Lotka'],
      positions: [['CM', 'CAM'], ['GK'], ['CB'], ['CAM', 'CM'], ['CAM', 'LW'], ['CB'], ['CDM', 'CB'], ['CM', 'CAM'], ['RW', 'LW'], ['ST'], ['LW', 'ST'], ['RW', 'ST'], ['LB'], ['CB', 'RB'], ['RB', 'LB'], ['ST'], ['LW', 'RW'], ['CDM'], ['ST'], ['CM', 'CAM'], ['RB', 'RM'], ['GK'], ['LB'], ['GK']],
      ratings: [91, 89, 87, 86, 85, 85, 84, 84, 84, 83, 82, 83, 82, 83, 81, 81, 80, 79, 79, 79, 78, 78, 80, 72]
    }
  }
};

const flattenSquads = (): Player[] => {
  return Object.entries(SQUADS).flatMap(([decade, clubs]) => 
    Object.entries(clubs).flatMap(([club, squadData]) => 
      squadData.names.map((name, i) => ({
        id: `${decade}-${club}-${i}`,
        name: name,
        club: club,
        decade: decade as any,
        positions: squadData.positions[i] as any,
        rating: squadData.ratings[i]
      }))
    )
  );
};

export const PLAYERS: Player[] = flattenSquads();
export const CLUBS = Array.from(new Set(PLAYERS.map(p => p.club)));
export const DECADES: string[] = ['1990s', '2000s', '2010s', '2020s'];