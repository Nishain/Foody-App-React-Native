
    // if you want to preview the template rename this file as template.html
    export default  //comment this line and remove enclosing ` the html tags
     `<h1>Bill Information</h1>
    <h2>Cart Details</h2>
    <table class="cart">
        <thead>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Discount</th>
        </thead>
    
        <tbody>
            {cart}
            <!-- {cart.repeat}
            <tr>
                <td>{name}</td>
                <td>{price}</td>
                <td>{quantity}</td>
                <td>{discount}</td>
            </tr>
            {cart.repeat} -->
        </tbody>
    </table>
    <h4>Details</h4>
    <table class="info">
        <tbody>
            {primaryData}
            <!-- don't remove this comment - this shows a repeating tag 
            {primaryData.repeat}
            <tr>
                <th><strong>{key}</strong></th>
                <td>{value}</td>
            </tr>
            {primaryData.repeat} --!>
            
        </tbody>
    </table>
    <hr/>
    <p><strong>Total Price: </strong>Rs {totalPrice}</p>
    <hr/>
    <div id="contactDetail">
        <br/>
        <br/>
        <hr id="signatureLine"/>
        <p>Customer signature</p>
        {contactDetail}
        <!-- {contactDetail.single}
        <img src="{companyLogo}" height=200 width=200 />
        <h4>{name}</h4>
        <p>{address}</p>
        <p><strong>(+94) </strong>{contact}</p>
        {contactDetail.single}
        -->
    </div>
    <style>
        .cart  thead{ 
            border-bottom: 1px solid black;
        }
        #signatureLine{
            width: 200px;
        }
        .cart td,tr{
            margin: 10px;
            text-align: center;
        }
        .info td,.info th{
            margin: 10px;
            text-align: left;
        }
        
        #contactDetail{
            float: right;
        }
        .row{
            flex-direction: row;
            justify-items: right;
        }
    </style>`
