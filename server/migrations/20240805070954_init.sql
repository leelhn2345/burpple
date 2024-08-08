create table if not exists restaurants (
  id serial primary key,
  name text not null,
  address text not null,
  cuisine text not null,
  description text not null,
  vector tsvector,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

-- create function to update the tsvector column
create function update_tsvector_body () returns trigger as $$
begin
  new.vector :=
  setweight(to_tsvector('english', coalesce(new.name, '')), 'A')
  || setweight(to_tsvector('english', coalesce(new.cuisine, '')), 'B')
  || setweight(to_tsvector('english', coalesce(new.address, '')), 'C');
  return new;
end
$$ LANGUAGE plpgsql;

-- Create the trigger to update the tsvector column on INSERT or UPDATE
CREATE TRIGGER tsvectorupdate BEFORE INSERT
OR
UPDATE ON restaurants FOR EACH ROW
EXECUTE FUNCTION update_tsvector_body ();

-- Create an index on the tsv column
CREATE INDEX idx_vector ON restaurants USING GIN (vector);

insert into
  restaurants (
    name,
    address,
    cuisine,
    description,
    created_at,
    updated_at
  )
values
  (
    'The Gourmet Kitchen',
    '123 Main St, Springfield',
    'Italian',
    'A fine dining experience with authentic Italian cuisine.',
    current_timestamp,
    current_timestamp
  ),
  (
    'Sushi Delight',
    '456 Elm St, Springfield',
    'Japanese',
    'Fresh sushi and sashimi prepared by expert chefs.',
    current_timestamp,
    current_timestamp
  ),
  (
    'Taco Fiesta',
    '789 Oak St, Springfield',
    'Mexican',
    'A vibrant atmosphere with delicious tacos and margaritas.',
    current_timestamp,
    current_timestamp
  ),
  (
    'Burger Haven',
    '101 Maple St, Springfield',
    'American',
    'Juicy burgers and crispy fries in a family-friendly setting.',
    current_timestamp,
    current_timestamp
  ),
  (
    'Curry Palace',
    '202 Pine St, Springfield',
    'Indian',
    'Aromatic spices and traditional Indian dishes.',
    current_timestamp,
    current_timestamp
  ),
  (
    'Dragon Wok',
    '303 Cedar St, Springfield',
    'Chinese',
    'Classic Chinese cuisine with a modern twist.',
    current_timestamp,
    current_timestamp
  ),
  (
    'Le Petit Bistro',
    '404 Birch St, Springfield',
    'French',
    'Cozy bistro offering traditional French fare.',
    current_timestamp,
    current_timestamp
  ),
  (
    'Mediterranean Grill',
    '505 Ash St, Springfield',
    'Mediterranean',
    'Fresh and healthy Mediterranean dishes.',
    current_timestamp,
    current_timestamp
  ),
  (
    'Pizza Paradise',
    '606 Walnut St, Springfield',
    'Italian',
    'Hand-tossed pizzas with a variety of toppings.',
    current_timestamp,
    current_timestamp
  ),
  (
    'Seafood Shack',
    '707 Chestnut St, Springfield',
    'Seafood',
    'Fresh seafood served in a casual environment.',
    current_timestamp,
    current_timestamp
  ),
  (
    'Steakhouse Supreme',
    '808 Redwood St, Springfield',
    'American',
    'Prime steaks and an extensive wine list.',
    current_timestamp,
    current_timestamp
  ),
  (
    'Veggie Delight',
    '909 Fir St, Springfield',
    'Vegetarian',
    'Delicious vegetarian and vegan options.',
    current_timestamp,
    current_timestamp
  ),
  (
    'Baklava Bliss',
    '111 Poplar St, Springfield',
    'Middle Eastern',
    'Authentic Middle Eastern sweets and pastries.',
    current_timestamp,
    current_timestamp
  ),
  (
    'Southern Comfort',
    '222 Spruce St, Springfield',
    'Southern',
    'Hearty Southern dishes and hospitality.',
    current_timestamp,
    current_timestamp
  ),
  (
    'BBQ Barn',
    '333 Hemlock St, Springfield',
    'BBQ',
    'Smoked meats and classic BBQ sides.',
    current_timestamp,
    current_timestamp
  ),
  (
    'Thai Terrace',
    '444 Cypress St, Springfield',
    'Thai',
    'Spicy and flavorful Thai cuisine.',
    current_timestamp,
    current_timestamp
  ),
  (
    'Greek Taverna',
    '555 Willow St, Springfield',
    'Greek',
    'Traditional Greek dishes and fresh ingredients.',
    current_timestamp,
    current_timestamp
  ),
  (
    'Korean BBQ House',
    '666 Pine St, Springfield',
    'Korean',
    'Interactive dining with tabletop grills.',
    current_timestamp,
    current_timestamp
  ),
  (
    'Tapas Tapas',
    '777 Maple St, Springfield',
    'Spanish',
    'A variety of small plates and sangria.',
    current_timestamp,
    current_timestamp
  ),
  (
    'Vietnamese Pho',
    '888 Oak St, Springfield',
    'Vietnamese',
    'Traditional Vietnamese pho and more.',
    current_timestamp,
    current_timestamp
  ),
  (
    'The Mediterranean Table',
    '999 Maple St, Springfield',
    'Mediterranean',
    'Mediterranean dishes with a modern twist.',
    current_timestamp,
    current_timestamp
  ),
  (
    'Cafe Delights',
    '1010 Elm St, Springfield',
    'American',
    'Coffee and light bites in a cozy atmosphere.',
    current_timestamp,
    current_timestamp
  ),
  (
    'Spicy Szechuan',
    '1111 Pine St, Springfield',
    'Chinese',
    'Spicy Szechuan cuisine and traditional favorites.',
    current_timestamp,
    current_timestamp
  ),
  (
    'Bistro Bella',
    '1212 Oak St, Springfield',
    'French',
    'Charming bistro with classic French dishes.',
    current_timestamp,
    current_timestamp
  ),
  (
    'Tandoori Nights',
    '1313 Ash St, Springfield',
    'Indian',
    'Richly spiced tandoori dishes and more.',
    current_timestamp,
    current_timestamp
  ),
  (
    'El Camino',
    '1414 Cedar St, Springfield',
    'Mexican',
    'Authentic Mexican food with a vibrant atmosphere.',
    current_timestamp,
    current_timestamp
  ),
  (
    'The Great Wall',
    '1515 Maple St, Springfield',
    'Chinese',
    'Traditional Chinese cuisine with a variety of options.',
    current_timestamp,
    current_timestamp
  ),
  (
    'Noodle House',
    '1616 Birch St, Springfield',
    'Japanese',
    'Delicious noodles and traditional Japanese dishes.',
    current_timestamp,
    current_timestamp
  ),
  (
    'The Italian Bistro',
    '1717 Walnut St, Springfield',
    'Italian',
    'Rustic Italian cuisine with a cozy ambiance.',
    current_timestamp,
    current_timestamp
  ),
  (
    'Sushi Express',
    '1818 Chestnut St, Springfield',
    'Japanese',
    'Quick and fresh sushi for a fast meal.',
    current_timestamp,
    current_timestamp
  ),
  (
    'Pizza Palace',
    '1919 Fir St, Springfield',
    'Italian',
    'Classic pizza and Italian dishes in a casual setting.',
    current_timestamp,
    current_timestamp
  ),
  (
    'Green Garden',
    '2020 Spruce St, Springfield',
    'Vegetarian',
    'Healthy vegetarian options and fresh ingredients.',
    current_timestamp,
    current_timestamp
  ),
  (
    'Seafood Delight',
    '2121 Pine St, Springfield',
    'Seafood',
    'A wide variety of seafood dishes and specials.',
    current_timestamp,
    current_timestamp
  ),
  (
    'Barbecue Haven',
    '2222 Oak St, Springfield',
    'BBQ',
    'Smoky BBQ dishes with all the fixings.',
    current_timestamp,
    current_timestamp
  ),
  (
    'Greek Grill',
    '2323 Elm St, Springfield',
    'Greek',
    'Traditional Greek grilling and flavors.',
    current_timestamp,
    current_timestamp
  ),
  (
    'The Tandoor',
    '2424 Maple St, Springfield',
    'Indian',
    'Authentic tandoori dishes and Indian specialties.',
    current_timestamp,
    current_timestamp
  ),
  (
    'Szechuan Garden',
    '2525 Cedar St, Springfield',
    'Chinese',
    'Szechuan and other regional Chinese dishes.',
    current_timestamp,
    current_timestamp
  ),
  (
    'The French Corner',
    '2626 Ash St, Springfield',
    'French',
    'Fine French dining with a touch of elegance.',
    current_timestamp,
    current_timestamp
  ),
  (
    'Mediterranean Oasis',
    '2727 Birch St, Springfield',
    'Mediterranean',
    'Mediterranean cuisine in a relaxed setting.',
    current_timestamp,
    current_timestamp
  ),
  (
    'The Sushi Spot',
    '2828 Walnut St, Springfield',
    'Japanese',
    'Fresh and inventive sushi dishes.',
    current_timestamp,
    current_timestamp
  ),
  (
    'The BBQ Pit',
    '2929 Chestnut St, Springfield',
    'BBQ',
    'Hearty BBQ meals and comfort food.',
    current_timestamp,
    current_timestamp
  ),
  (
    'Pasta House',
    '3030 Pine St, Springfield',
    'Italian',
    'Delicious pasta dishes with homemade sauces.',
    current_timestamp,
    current_timestamp
  ),
  (
    'Taco Truck',
    '3131 Fir St, Springfield',
    'Mexican',
    'Authentic tacos and Mexican street food.',
    current_timestamp,
    current_timestamp
  ),
  (
    'The Vegan Table',
    '3232 Spruce St, Springfield',
    'Vegetarian',
    'Innovative vegan and vegetarian dishes.',
    current_timestamp,
    current_timestamp
  ),
  (
    'Pho House',
    '3333 Maple St, Springfield',
    'Vietnamese',
    'Hearty pho and Vietnamese cuisine.',
    current_timestamp,
    current_timestamp
  ),
  (
    'The Bistro',
    '3434 Elm St, Springfield',
    'French',
    'Classic French bistro fare in a quaint setting.',
    current_timestamp,
    current_timestamp
  );
