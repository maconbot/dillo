// Notifications

// Fetch json
function getNotifications(){
	$.getJSON( "/notifications", function( data ) {

		var items = [];
		var unread_ctr = 0;

		$('#notifications-refresh-icon').addClass('fa-spin');

		// Only if there's actual data
		if (data['items'][0]){

			// Loop through each item
			$.each(data['items'], function(i, no){

				// Increase the unread_ctr counter
				if (!no['is_read']){ unread_ctr++ };

				// Check if the current item has been read,
				// so we can style it nicely
				is_read = no['is_read'] ? 'is_read' : '';

				// List item
				content = '<li class="nc-item ' + is_read +'">';

					// Avatar linking to username profile
					content += '<div class="nc-avatar">';
						content += '<a href="' + no['username_url'] + '">';
						content += '<img src="' + no['username_avatar'] + '"/> ';
						content += '</a>';
					content += '</div>';

					// Text of the notification
					content += '<div class="nc-text">';

						// Username
						content += '<a href="' + no['username_url'] + '">' + no['username'] + '</a> ';

						// Action
						content += no['action'] + ' ';

						// Object
						content += '<a href="' + no['object_url'] + '">';
							content += no['context_object_name'] + ' ';
						content += '</a> ';

						// Date
						content += '<span class="nc-date">';
							content += '<a href="' + no['object_url'] + '">' + no['date'] + '</a>';
						content += '</span>';

						// Read Toggle
						content += '<a href="/notifications/' + no['_id'] + '/read-toggle" class="nc-button nc-read_toggle">';
							if (no['is_read']){
								content += '<i title="Mark as Unread" class="fa fa-eye-slash"></i>';
							} else {
								content += '<i title="Mark as Read" class="fa fa-eye"></i>';
							};
						content += '</a>';

						// Subscription Toggle
						content += '<a href="/notifications/' + no['_id'] + '/subscription-toggle" class="nc-button nc-subscription_toggle">';
							if (no['is_subscribed']){
								content += '<i title="Turn On Notifications" class="fa fa-toggle-off"></i>';
							} else {
								content += '<i title="Turn Off Notifications" class="fa fa-toggle-on"></i>';
							};
						content += '</a>';

					content += '</div>';
				content += '</li>';

				items.push(content);
			});

			if (unread_ctr > 0) {
				// Set page title, display notifications and set counter
				document.title = '(' + unread_ctr + ') ' + page_title;
				$('#notifications-count').addClass('bloom');
				$('#notifications-count').text(unread_ctr);
			};
		} else {
			content = '<li class="nc-item nc-item-empty">';
			content += 'No notifications... yet';
			content += '</li>';

			items.push(content);
		};

		// Populate the list
		$('#notifications-list').html( items.join('') );
	})
	.done(function(){
		// Stop spinning the refresh icon when we're done
		$('#notifications-refresh-icon').removeClass('fa-spin');
	});
};

// Used when we click somewhere in the page
function hideNotifications(){
	$('#notifications').hide();
	$('#notifications-toggle').removeAttr('class');
};

// Click anywhere in the page to hide the #notifications
$(document).click(function() { hideNotifications(); });

// Function to set #notifications flyout height and resize if needed
function notificationsResize(){
	height = $(window).height() - 80;

	if ($('#notifications').height() > height){
		$('#notifications').css({
				'max-height' : height,
				'overflow-y' : 'scroll'
			}
		);
	} else {
		$('#notifications').css({
				'max-height' : 'initial',
				'overflow-y' : 'initial'
			}
		);
	};
};

// Toggle the #notifications flyout
$('#notifications-toggle').on('click', function(e){
	e.stopPropagation();

	$('#notifications').toggle();
	$(this).toggleClass("active");

	notificationsResize();
	getNotifications();
});


// Read/Subscription Toggles
$('#notifications-list').on('click', '.nc-button', function(e){
	e.preventDefault();

	$.get($(this).attr('href'));
	getNotifications();
});

// Mark All as Read
$('#notifications-markallread').on('click', function(e){
	e.preventDefault();

	$.get("/notifications/read-all");
	$('#notifications-count').removeAttr('class');
	document.title = page_title;
	getNotifications();
});

// Refresh Notifications Feed
$('#notifications-refresh').on('click', function(){ getNotifications(); });

// Clicking inside the #notifications flyout shouldn't hide it
$('#notifications').on('click', function(e){ e.stopPropagation(); });

$(document).ready(function() {

	getNotifications();
	setInterval(getNotifications, 30000);

	// Resize #notifications and change overflow for scrollbars
	$(window).on("resize", function() { notificationsResize(); });

	// Load perfectScrollbar
	$('#notifications').perfectScrollbar();

});
