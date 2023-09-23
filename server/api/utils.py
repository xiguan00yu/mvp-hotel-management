import json
from fake_useragent import UserAgent
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright


def parse_marriott_rooms(code, from_date, to_date):
    try:
        page_uri = f'https://www.marriott.com/reservation/availabilitySearch.mi?isSearch=false&isRateCalendar=false&numberOfRooms=1&numberOfAdults=1&numberOfChildren=0&useRewardsPoints=false&propertyCode={code}&fromDate={from_date}&toDate={to_date}'
        with sync_playwright() as p:
            browser = p.chromium.launch(
                # headless=False,
            )
            context = browser.new_context(
                user_agent=UserAgent().random)
            page = context.new_page()
            # 1. into homepage
            # 2. goto find hotel-room page
            try:
                page.goto('https://www.marriott.com', timeout=1000 * 2)
            except Exception as e:
                print(f"Error: {str(e)}")
            page.goto(page_uri)
            page.wait_for_selector(
                '.rate-card-container, .js-filtered-room-list', timeout=10000, state='attached')
            html = page.content()
            browser.close()

            soup = BeautifulSoup(html, 'html.parser')

            # option 1 by json data
            filtered_list_div = soup.find(
                'div', class_='js-filtered-room-list')

            if filtered_list_div:
                ers4RoomList_value = filtered_list_div.attrs.get(
                    'data-ers4-room-list')
                room_data = json.loads(ers4RoomList_value)
                # with open('page_content_link1.json', 'w', encoding='utf-8') as file:
                #         file.write(ers4RoomList_value)
                def toRoom(room_element):
                    room = {
                        'room_name': getattr(room_element, 'description', 'N/A'),
                        'room_details_list': []
                    }
                    for item in getattr(room_element, 'roomDetailsList', []):
                        room['room_details_list'].append({
                            "actualRoomsAvailable": getattr(item, 'actualRoomsAvailable', 'N/A'),
                            "rateAmount": getattr(item, 'rateAmount', 'N/A'),
                            "priceText": getattr(item, 'priceText', 'N/A'),
                            "description": getattr(item, 'description', 'N/A'),
                            "currency": getattr(item, 'currency', 'N/A'),
                        })
                return map(toRoom, room_data)

            # option 2 by parse card
            room_data = []
            rate_card_containers = soup.find_all(
                'div', class_='rate-card-container')

            for rate_card_container in rate_card_containers:

                room_name_tag = rate_card_container.find(
                    'h3', class_='room-name')
                if room_name_tag is None:
                    continue

                first_image_tag = rate_card_container.find(
                    'div', class_='image-container').find('img')
                if first_image_tag:
                    first_image_url = first_image_tag['data-src']
                else:
                    first_image_url = 'N/A'

                try:
                    actual_rooms_available = rate_card_container.find(
                        'span', class_='sold-out-label').text.strip()
                    rooms_available = int(actual_rooms_available.replace(
                        '\n', '').strip().split()[0]) if actual_rooms_available else None
                except AttributeError:
                    rooms_available = "N/A"

                try:
                    room_name = rate_card_container.find(
                        'h3', class_='room-name').text.strip()
                except AttributeError:
                    room_name = "N/A"

                room = {
                    'room_image': first_image_url,
                    'room_name': room_name,
                    'room_details_list': []}

                price_objects = rate_card_container.find_all(
                    'div', class_='rate-details')

                for price_object in price_objects:
                    try:
                        price_type = price_object.find(
                            'span', class_='rate-name').text.strip()
                    except AttributeError:
                        price_type = "N/A"

                    try:
                        rate_info = price_object.find(
                            'div', class_='rate-content')
                        room_rate = rate_info.find(
                            'span', class_='room-rate').text.strip()
                    except AttributeError:
                        room_rate = "N/A"

                    currency_tag = rate_info.find(
                        'span', class_='t-capitalize')
                    if currency_tag:
                        currency = currency_tag.text.strip().replace('/ Night', '')
                    else:
                        currency = 'N/A'

                    room['room_details_list'].append({
                        "actualRoomsAvailable": rooms_available,
                        "priceText": room_rate,
                        "description": price_type,
                        "currency": currency,
                    })
                room_data.append(room)

            return room_data

    except Exception as e:
        print(f"Exception: {e}")
        return []
