import type { Player } from '../types';

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
    }
  },
  '2000s': {
    'Barcelona': {
      names: ['Ronaldinho', 'Lionel Messi', 'Xavi', 'Carles Puyol', 'Andrés Iniesta', 'Dani Alves', 'Victor Valdés', 'Deco', 'Thierry Henry', 'Rafael Márquez', 'Giovanni van Bronckhorst', 'Samuel Eto\'o', 'Gerard Piqué', 'Yaya Touré', 'Eric Abidal', 'Pedro', 'Bojan Krkić', 'Sylvinho', 'Mark van Bommel', 'Henrik Larsson', 'Ludovic Giuly', 'Edmílson', 'Gianluca Zambrotta', 'Albert Jorquera'],
      positions: [['CAM', 'LW', 'RW'], ['RW', 'CAM', 'ST'], ['CM'], ['CB', 'RB'], ['CM', 'CAM', 'LW'], ['RB'], ['GK'], ['CM', 'CAM'], ['LW', 'ST'], ['CB', 'CDM'], ['LB'], ['ST'], ['CB'], ['CDM'], ['LB'], ['LW', 'RW'], ['ST'], ['LB'], ['CM'], ['ST'], ['RW'], ['CB', 'CDM'], ['RB', 'LB'], ['GK']],
      ratings: [97, 95, 94, 93, 92, 93, 89, 91, 92, 89, 88, 93, 88, 89, 87, 87, 86, 86, 86, 86, 85, 85, 85, 80]
    },
    'Man United': {
      names: ['Cristiano Ronaldo', 'Wayne Rooney', 'Paul Scholes', 'Rio Ferdinand', 'Nemanja Vidić', 'Edwin van der Sar', 'Ryan Giggs', 'Ruud van Nistelrooy', 'Michael Carrick', 'Patrice Evra', 'Gary Neville', 'Park Ji-sung', 'Darren Fletcher', 'Carlos Tevez', 'Louis Saha', 'Wes Brown', 'John O\'Shea', 'Tomasz Kuszczak', 'Owen Hargreaves', 'Nani', 'Anderson', 'Mikaël Silvestre', 'Alan Smith', 'Kieran Richardson'],
      positions: [['ST', 'LW'], ['ST', 'CAM'], ['CM'], ['CB'], ['CB'], ['GK'], ['LM', 'LW'], ['ST'], ['CDM', 'CM'], ['LB'], ['RB'], ['LM', 'RM'], ['CM'], ['ST'], ['ST'], ['CB', 'RB'], ['RB', 'LB', 'CDM'], ['GK'], ['CDM'], ['RW'], ['CAM'], ['CB', 'LB'], ['ST', 'CDM'], ['LM']],
      ratings: [94, 91, 92, 92, 91, 93, 90, 92, 89, 90, 88, 87, 86, 90, 86, 85, 85, 82, 86, 87, 85, 84, 84, 80]
    },
    'Bayern Munich': {
      names: ['Oliver Kahn', 'Stefan Effenberg', 'Giovane Élber', 'Bixente Lizarazu', 'Michael Ballack', 'Willy Sagnol', 'Roy Makaay', 'Bastian Schweinsteiger', 'Lúcio', 'Miroslav Klose', 'Philipp Lahm', 'Martin Demichelis', 'Mark van Bommel', 'Daniel Van Buyten', 'Zé Roberto', 'Andreas Görlitz', 'Torsten Frings', 'Owen Hargreaves', 'Roque Santa Cruz', 'Mehmet Scholl', 'Alexander Zickler', 'Hans-Jörg Butt', 'Lukas Podolski', 'Hamit Altıntop'],
      positions: [['GK'], ['CM'], ['ST'], ['LB'], ['CM', 'CAM'], ['RB'], ['ST'], ['CM', 'CDM'], ['CB'], ['ST'], ['LB', 'RB'], ['CB'], ['CDM'], ['CB'], ['CM', 'LM'], ['RB'], ['CM', 'RM'], ['CM', 'CDM'], ['ST'], ['CAM', 'RW'], ['ST'], ['GK'], ['ST'], ['RM', 'CM']],
      ratings: [94, 92, 90, 91, 92, 89, 91, 90, 92, 90, 92, 88, 89, 87, 89, 85, 88, 87, 86, 89, 85, 86, 85, 85]
    }
  },
  '2010s': {
    'Real Madrid': {
      names: ['Cristiano Ronaldo', 'Luka Modrić', 'Sergio Ramos', 'Karim Benzema', 'Toni Kroos', 'Marcelo', 'Casemiro', 'Keylor Navas', 'Dani Carvajal', 'Gareth Bale', 'Pepe', 'Isco', 'Raphaël Varane', 'Angel Di Maria', 'Iker Casillas', 'Fabio Coentrão', 'Xabi Alonso', 'Mateo Kovačić', 'Lucas Vázquez', 'Nacho', 'Alvaro Morata', 'Asier Illarramendi', 'James Rodríguez', 'Kiko Casilla'],
      positions: [['ST', 'LW'], ['CM', 'CAM'], ['CB'], ['ST'], ['CM', 'CDM'], ['LB'], ['CDM'], ['GK'], ['RB'], ['RW', 'ST'], ['CB'], ['CAM', 'CM'], ['CB'], ['RW', 'CM'], ['GK'], ['LB'], ['CDM'], ['CM'], ['RW', 'RB'], ['CB', 'RB', 'LB'], ['ST'], ['CDM'], ['CAM'], ['GK']],
      ratings: [99, 98, 97, 95, 96, 94, 93, 93, 91, 94, 91, 89, 90, 90, 90, 86, 91, 87, 85, 86, 86, 84, 90, 83]
    },
    'Liverpool': {
      names: ['Mohamed Salah', 'Sadio Mané', 'Virgil van Dijk', 'Alisson Becker', 'Roberto Firmino', 'Jordan Henderson', 'Andrew Robertson', 'Trent Alexander-Arnold', 'Georginio Wijnaldum', 'Fabinho', 'James Milner', 'Simon Mignolet', 'Dejan Lovren', 'Joel Matip', 'Joe Gomez', 'Daniel Sturridge', 'Philippe Coutinho', 'Emre Can', 'Alex Oxlade-Chamberlain', 'Adam Lallana', 'Daniel Agger', 'Lucas Leiva', 'Martin Škrtel', 'Loris Karius'],
      positions: [['RW', 'LW', 'ST'], ['LW', 'ST'], ['CB'], ['GK'], ['ST', 'CAM'], ['CM', 'CDM'], ['LB'], ['RB'], ['CM'], ['CDM'], ['CM', 'RB'], ['GK'], ['CB'], ['CB'], ['CB', 'RB'], ['ST'], ['CAM', 'LW'], ['CM', 'CDM'], ['CM', 'RW'], ['CAM', 'CM'], ['CB'], ['CDM'], ['CB'], ['GK']],
      ratings: [94, 92, 96, 94, 91, 89, 90, 92, 89, 90, 86, 85, 85, 87, 85, 86, 91, 85, 84, 84, 86, 86, 86, 80]
    }
  },
  '2020s': {
    'Man City': {
      names: ['Erling Haaland', 'Kevin De Bruyne', 'Rodri', 'Ruben Dias', 'Ederson', 'Bernardo Silva', 'Phil Foden', 'John Stones', 'Kyle Walker', 'Ilkay Gündoğan', 'Jack Grealish', 'Riyad Mahrez', 'Manuel Akanji', 'Nathan Aké', 'Aymeric Laporte', 'João Cancelo', 'Julian Alvarez', 'Oleksandr Zinchenko', 'Ferran Torres', 'Gabriel Jesus', 'Stefan Ortega', 'Rico Lewis', 'Oscar Bobb', 'Matheus Nunes'],
      positions: [['ST'], ['CAM', 'CM'], ['CDM'], ['CB'], ['GK'], ['CAM', 'RW'], ['CAM', 'LW', 'RW'], ['CB', 'CDM'], ['RB'], ['CM'], ['LW'], ['RW'], ['CB'], ['CB', 'LB'], ['CB'], ['LB', 'RB'], ['ST'], ['LB'], ['RW', 'ST'], ['ST'], ['GK'], ['RB'], ['RW'], ['CM']],
      ratings: [97, 97, 96, 93, 92, 94, 93, 91, 90, 90, 88, 88, 88, 87, 87, 87, 87, 85, 85, 85, 84, 84, 82, 82]
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
