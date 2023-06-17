/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return new Promise(function(resolve, reject) {
      knex.transaction(function(trx) {
        return Promise.all([
          trx.raw(`
            INSERT INTO sizes (description, basePrice)
            VALUES
            ('Aro 10 cm (4 a 5 fatias)', 80),
            ('Aro 15 cm (12 a 15 fatias)', 150),
            ('Aro 17 cm (18 a 20 fatias)', 190),
            ('Aro 20 cm (25 a 28 fatias)', 230),
            ('Aro 23 cm (30 a 35 fatias)', 265),
            ('Aro 25 cm (38 a 40 fatias)', 320)
          `),
          trx.raw(`
            INSERT INTO batters (description, basePrice)
            VALUES
            ('Massa branca', 0),
            ('Massa de chocolate', 0)
          `),
          trx.raw(`
            INSERT INTO fillings (description, basePrice)
            VALUES
            ('Brigadeiro tradicional', 0),
            ('Brigadeiro meio amargo', 0),
            ('Brigadeiro branco', 0),
            ('Brigadeiro de leite ninho', 0),
            ('Brigadeiro de oreo', 0),
            ('Brigadeiro de paçoca', 0),
            ('Brigadeiro de amendoim', 0),
            ('Brigadeiro de prestígio', 0),
            ('Beijinho de coco', 0),
            ('Recheio 4 leites', 0),
            ('Doce de leite', 0),
            ('Brigadeiro de maracujá', 15),
            ('Brigadeiro de limão siciliano', 15),
            ('Brigadeiro de cream cheese', 15),
            ('Geleia de morango', 15),
            ('Geleia de frutas amarelas', 15),
            ('Doce de leite com nozes', 15)
          `),
          trx.raw(`
            INSERT INTO order_status (status)
            VALUES
            ('Accomplished'),
            ('Preparing'),
            ('Delivered'),
            ('Canceled')        
          `) 
        ])
        .then(function() {
          resolve();
        })
        .catch(function(error) {
          reject(error);
        });
      });
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return Promise.resolve();
  };
  