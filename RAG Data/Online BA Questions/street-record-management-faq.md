# Street Management FAQ - Idox Public Protection System

## How do I access street management functionality?

**Navigation Path:**
1. Go to main application interface
2. Click **"Locations"** menu in left navigation panel  
3. Under **"Streets"** section, choose from:
   - **Search Streets**: `locations/index.html?area=Street&fa=search`
   - **Create Street**: `locations/index.html?area=Street&fa=add` (requires Locations Read/Write permission)
   - **Merge Streets**: `locations/index.html?area=Street&fa=search&merge=t` (requires Administrator permission)

**Alternative Access:**
- Street popup window: `/streets/popup_street.html`
- Called from other modules (Planning, Complaints) via JavaScript `searchStreetPopup()` function

## How do I create a new street record?

**Steps:**
1. Navigate to **"Create Street"** from Locations > Streets menu
2. Fill out form fields:
   - **Street Name** (Required - cannot be empty)
   - **Locality** (Optional)
   - **Town** (Optional) 
   - **County** (Optional)
   - **Postcode** (Optional)
3. Click **"Add"** button (form action `fa=a_s`)

**Backend Process:**
- System generates unique ID automatically
- Creates new record with street details and user information
- Logs audit event for street creation
- Shows success message: "Street Created Successfully"
- Redirects to edit mode for new street

## How do I edit an existing street record?

**Access Methods:**
1. **Via Search**: Search for street, then select from results
2. **Direct Access**: Use URL `fa=v_ss&id=[street_id]`

**Edit Process:**
1. System loads street data using `getStreetArr()` method from `class.StreetsAdmin.php:285`
2. Edit form displays with populated fields
3. Modify any fields (Street Name still required)
4. Click **"Update"** button (form action `fa=u_s`)

**Backend Process:**
- Updates active street records only (not deleted/ceased records)
- Modifies street name, locality, town, county, and postcode fields
- Logs audit event for street updates
- Shows success message: "Street Updated Successfully"

## How do I search for street records?

**Search Access:**
- Click **"Search Streets"** from Locations > Streets menu
- Form action `fa=s_s` handled by `advancedSearchStreets()` method

**Search Criteria:**
- **Street Name**: Partial matching supported (search for part of street name)
- **Locality**: Partial matching supported (search for part of locality)
- **Town**: Partial matching supported (search for part of town name)
- **County**: Partial matching supported (search for part of county name)
- **Postcode**: Partial matching supported (search for part of postcode)

**Results Features:**
- Paginated results with configurable page size
- Sortable columns (street name, locality, town, county, postcode)
- Select button to choose street from search results

## What information is stored for street records?

**Required Information:**
- **Unique ID** (Generated automatically by system)
- **Street Name** (Must be provided, validated when entering)

**Optional Information:**
- **Locality** (Area within town/city)
- **Town** (Town or city name)
- **County** (County information)
- **Postcode** (Postal code)
- **Creation User** (Set automatically to current user)
- **Record Status** (Active by default, can be marked as ceased)

## What permissions do I need for street management?

**View/Search Streets:**
- Basic user access (no special permissions required)

**Create/Edit Streets:**
- Locations Read/Write permission required

**Administrative Functions (Merge):**
- Administrator permission required

## What validation exists for street records?

**Client-Side Validation:**
- Street name cannot be empty (JavaScript validation in templates)
- Error alert shows: "you must enter a street name"

**Server-Side Processing:**
- Only updates active records (not deleted or ceased records)
- Data formatting: Proper capitalization applied to street names, locality, town, county

## How does audit logging work for streets?

**Audit Events:**
- **Street Creation**: Street creation events automatically logged
- **Street Updates**: Street update events automatically logged  
- User information automatically captured in audit trails

## What are the key system files for street management?

**Core Files:**
- **Main Controller**: `/public_html/streets/popup_street.html`
- **Business Logic**: `/php/classes/class.StreetsAdmin.php`
- **Data Object**: `/php/objects/object.Street.php`

**Templates:**
- **Create Form**: `/templates/streets/popup_create_street.tpl`
- **Edit Form**: `/templates/streets/popup_edit_street.tpl` 
- **Search Form**: `/templates/streets/popup_street_search_form.tpl`
- **Search Results**: `/templates/streets/popup_street_search_results.tpl`
- **Street List**: `/templates/streets/popup_view_streets.tpl`

**JavaScript:**
- **Planning Integration**: `/public_html/js/plannings.js` (contains `searchStreetPopup()`)

## What are the form actions used in street management?

**Form Actions (fa parameter):**
- `fa=n_s`: New street form (loads create template)
- `fa=a_s`: Add street (calls `addStreet()` method)
- `fa=u_s`: Update street (calls `updateStreet()` method)  
- `fa=s_s`: Search streets (calls `advancedSearchStreets()` method)
- `fa=v_ss`: View single street (calls `getStreetArr()` method)
- `fa=l_s`: List streets (calls `getStreetsArr()` method)

## How do other modules integrate with street management?

**Planning Module:**
- Uses `searchStreetPopup(root, menu)` function from `/public_html/js/plannings.js:17`
- Opens street popup at `/streets/popup_street.html` for location selection

**Template Integration:**
- Menu structure defined in `/templates/menus/locations.tpl:64-92`
- Street selection via `selectStreet()` JavaScript function passes: `id, street, locality, town, county, postcode`

**Popup Integration:**
- Called via `window.open()` with dimensions 800x600
- Uses `window.opener.setStreetDetails()` to return selected street data