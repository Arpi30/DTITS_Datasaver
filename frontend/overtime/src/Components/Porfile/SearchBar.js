import { Form, Button } from 'react-bootstrap';

export const SearchBar = ({handleSearch, searchItem}) => {
    return (
        <div className="searchBar me-3">
            <Form className='d-flex flex-row'>
                <Form.Control onChange={handleSearch} value={searchItem} placeholder="Keresés..." type="text" className='me-1'/>
                {/* <Button type="submit">Keresés</Button> */}
            </Form>
        </div>
    )
}