describe('flexDetect', () => {
	let fakeDocNoFlex;
	let fakeDocHasFlex;

	beforeEach((done) => {
		fakeDocNoFlex = {
			createElement: (arg) => {
				return {
					style: {
						flex: undefined
					}
				};
			}
		};
		fakeDocHasFlex = {
			createElement: (arg) => {
				return {
					style: {
						flex: true
					}
				};
			}
		};

		$('body').removeClass('no-flex');
		done();
	});

	it('should not detect flexbox', (done) => {
		bcpl.utility.flexDetect.init(fakeDocNoFlex);

		expect($('body').hasClass('no-flex')).toBe(true);
		done();
	});

	it('should detect flexbox', (done) => {
		bcpl.utility.flexDetect.init(fakeDocHasFlex);

		expect($('body').hasClass('no-flex')).toBe(false);

		done();
	});
});
