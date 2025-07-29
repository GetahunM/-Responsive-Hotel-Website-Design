 // Global JavaScript for order processing and room booking
        function submitOrder(category) {
            let nameInput, checkboxes, orderSummaryElement;

            if (category === 'food') {
                nameInput = document.getElementById("foodCustomerName");
                checkboxes = document.querySelectorAll('input[name="foodItem"]:checked');
                orderSummaryElement = document.getElementById("foodOrderSummary");
            } else if (category === 'drinks') {
                nameInput = document.getElementById("drinkCustomerName");
                checkboxes = document.querySelectorAll('input[name="drinkItem"]:checked');
                orderSummaryElement = document.getElementById("drinksOrderSummary");
            } else {
                console.error("Invalid category for submitOrder function.");
                return;
            }

            const name = nameInput.value.trim();
            let selectedItems = [];
            let totalCost = 0;

            checkboxes.forEach(cb => {
                // Get the text content excluding the price for cleaner display
                const itemTextFull = cb.parentElement.textContent.trim();
                const itemText = itemTextFull.split(':')[0].trim(); // Get item name without price
                const price = parseFloat(cb.dataset.price); // Get price from data-price attribute
                selectedItems.push(itemText);
                totalCost += price;
            });

            if (!name || selectedItems.length === 0) {
                alert("Please enter your name and select at least one item.");
                return;
            }

            const orderDetails = `Thank you, ${name}! You have ordered: ${selectedItems.join(", ")}. Your total is: $${totalCost.toFixed(2)}`;

            // Display success message in the specific order summary paragraph
            orderSummaryElement.textContent = orderDetails;
            $(orderSummaryElement).fadeIn().delay(5000).fadeOut(); // Fade in, show for 5s, then fade out

            // Clear inputs and checkboxes
            nameInput.value = "";
            checkboxes.forEach(cb => cb.checked = false);
        }

        // Room Booking Modal Logic
        $('#roomBookingModal').on('show.bs.modal', function (event) {
            const button = $(event.relatedTarget); // Button that triggered the modal
            const roomType = button.data('room'); // Extract info from data-* attributes
            const roomPrice = button.data('price');

            const modal = $(this);
            modal.find('.modal-title').text('Book ' + roomType);
            modal.find('#roomType').val(roomType);
            modal.find('#roomPrice').val(roomPrice + '/night');

            // Calculate initial total cost
            updateTotalBookingCost();
        });

        // Event listeners for date and guest number changes to update total cost
        $('#checkInDate, #checkOutDate, #numGuests').on('change', function() {
            updateTotalBookingCost();
        });

        function updateTotalBookingCost() {
            const checkInDate = new Date($('#checkInDate').val());
            const checkOutDate = new Date($('#checkOutDate').val());
            const numGuests = parseInt($('#numGuests').val());
            const roomPricePerNight = parseFloat($('#roomPrice').val().split('/')[0]);

            let totalCost = 0;
            if (checkInDate && checkOutDate && !isNaN(roomPricePerNight) && numGuests >= 1) {
                const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
                const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Calculate days difference

                if (diffDays > 0) {
                    totalCost = roomPricePerNight * diffDays;
                }
            }
            $('#totalBookingCost').text(totalCost.toFixed(2));
        }

        // Handle room booking form submission (client-side simulation)
        $('.room-booking-form').on('submit', function(e) {
            e.preventDefault(); // Prevent default form submission

            const roomType = $('#roomType').val();
            const guestName = $('#guestName').val();
            const guestEmail = $('#guestEmail').val();
            const checkIn = $('#checkInDate').val();
            const checkOut = $('#checkOutDate').val();
            const numGuests = $('#numGuests').val();
            const totalCost = $('#totalBookingCost').text();

            if (!checkIn || !checkOut || new Date(checkOut) <= new Date(checkIn)) {
                alert("Please select valid check-in and check-out dates.");
                return;
            }

            // In a real application, you would send this data to your server
            alert(`Booking Confirmed!\n\nRoom Type: ${roomType}\nGuest Name: ${guestName}\nEmail: ${guestEmail}\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nGuests: ${numGuests}\nTotal Cost: $${totalCost}\n\nThank you for booking with Getahun Hotel!`);

            // Optionally close the modal and reset the form
            $('#roomBookingModal').modal('hide');
            $('.room-booking-form')[0].reset(); // Reset form fields
            $('#totalBookingCost').text('0.00'); // Reset total cost display
        });


        // Smooth scrolling for navigation links
        $(document).ready(function(){
            $("a").on('click', function(event) {
                if (this.hash !== "") {
                    event.preventDefault();
                    const hash = this.hash;
                    $('html, body').animate({
                        scrollTop: $(hash).offset().top
                    }, 800, function(){
                        window.location.hash = hash;
                    });
                }
            });

            // Set min date for check-in to today
            const today = new Date().toISOString().split('T')[0];
            document.getElementById("checkInDate").setAttribute('min', today);
            document.getElementById("checkOutDate").setAttribute('min', today);

            // Ensure check-out is not before check-in
            $('#checkInDate').on('change', function() {
                $('#checkOutDate').attr('min', $(this).val());
                if ($('#checkOutDate').val() < $(this).val()) {
                    $('#checkOutDate').val($(this).val());
                }
            });
        });